import { NextResponse } from "next/server";
import { getCurriculum } from "@/lib/curriculum";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequestBody = {
  messages?: unknown;
  lessonContext?: {
    title?: unknown;
    chapter?: unknown;
  };
};

const MAX_MESSAGES = 24;
const MAX_CONTENT_LENGTH = 6000;

function buildSystemPrompt(context?: { title?: string; chapter?: string }) {
  const chapters = getCurriculum()
    .map((chapter) => `- ${chapter.title} (${chapter.titleFr})`)
    .join("\n");

  const lessonContext =
    context?.title && context?.chapter
      ? `\n\nالطالب يقرأ حاليًا درس «${context.title}» من محور «${context.chapter}». اربط شرحك بهذا الدرس عندما يكون ذلك مناسبًا.`
      : "";

  return `أنت "Tutorly"، مساعد تعليمي ذكي متخصص في الرياضيات لمستوى البكالوريا الجزائرية (السنة الثالثة ثانوي، الشعب العلمية).

محتوى المنهاج المتوفر في التطبيق:
${chapters}

قواعد الإجابة:
- أجب بالعربية الفصحى المبسطة، وأضف المصطلح الفرنسي بين قوسين عند الحاجة.
- اكتب كل الرياضيات بصيغة LaTeX: استعمل $...$ داخل السطر و $$...$$ للسطر المستقل. لا تكتب رموز رياضية كنص عادي.
- اشرح خطوة بخطوة، واذكر القاعدة أو المبرهنة المستعملة قبل تطبيقها.
- كن دقيقًا ومنظمًا؛ استعمل عناوين قصيرة وقوائم عند الحاجة. لا تطل دون فائدة.
- إذا كان السؤال غامضًا، اطرح سؤال توضيحي واحدًا.
- لا تختلق معطيات، وإذا لم تكفِ المعلومات فقل ذلك بوضوح.
- لا تقدّم وعدًا بعلامة مضمونة في البكالوريا، بل ساعد الطالب على الفهم والمنهجية.
- إذا كان السؤال خارج الرياضيات، ذكّر بلطف أن تخصصك هو الرياضيات وأعد التوجيه.
- استعمل تنسيق Markdown بسيطًا: عناوين ##، قوائم، وجداول عند الحاجة.${lessonContext}`;
}

function demoResponse(context?: { title?: string; chapter?: string }) {
  const scope = context?.title
    ? `درس «${context.title}» من محور «${context.chapter}» `
    : "دروس الرياضيات ";

  return `مرحبًا! أنا **Tutorly**، مساعدك في رياضيات البكالوريا. 👋

المساعد يعمل حاليًّا في **الوضع التجريبي** لأن مفتاح DeepSeek API غير مُعدّ بعد. يمكنك تصفح ${scope}والاستفادة من كل الدروس والملخصات الموجودة في التطبيق.

**لتفعيل الذكاء الاصطناعي:**
1. أضف المتغير \`DEEPSEEK_API_KEY\` في ملف \`.env.local\`.
2. أعد تشغيل الخادم.

**في هذه الأثناء، إليك منهجية مفيدة لحل أي تمرين:**
- اقرأ المعطيات وحدّد المطلوب بدقة.
- اكتب القاعدة أو المبرهنة المناسبة قبل الحساب.
- نظّم الحل خطوة بخطوة، وتحقق من الوحدات ومجموعة التعريف.
- أعد قراءة النتيجة: هل تبدو منطقية؟

جرّب أيضًا فتح درس من صفحة **الدروس**، وستجد تعريفات وتمارين محلولة لكل محور.`;
}

function parseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input)) return null;
  const messages: ChatMessage[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string" ||
      content.trim().length === 0 ||
      content.length > MAX_CONTENT_LENGTH
    ) {
      return null;
    }
    messages.push({ role, content: content.trim() });
  }
  if (messages.length === 0 || messages.length > MAX_MESSAGES) return null;
  if (messages[messages.length - 1].role !== "user") return null;
  return messages;
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صالح." }, { status: 400 });
  }

  const messages = parseMessages(body.messages);
  if (!messages) {
    return NextResponse.json(
      { error: "صيغة المحادثة غير صالحة." },
      { status: 400 },
    );
  }

  const context =
    body.lessonContext &&
    typeof body.lessonContext.title === "string" &&
    typeof body.lessonContext.chapter === "string"
      ? {
          title: body.lessonContext.title.slice(0, 160),
          chapter: body.lessonContext.chapter.slice(0, 160),
        }
      : undefined;

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(demoResponse(context), {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Tutorly-Mode": "demo",
      },
    });
  }

  const baseUrl = (process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com").replace(
    /\/+$/,
    "",
  );
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.4,
        max_tokens: 1800,
        messages: [
          { role: "system", content: buildSystemPrompt(context) },
          ...messages,
        ],
      }),
      signal: AbortSignal.timeout(55000),
    });

    if (!upstream.ok || !upstream.body) {
      const detail = await upstream.text().catch(() => "");
      console.error("DeepSeek error:", upstream.status, detail.slice(0, 500));
      return NextResponse.json(
        {
          error:
            "تعذر الاتصال بمساعد الذكاء الاصطناعي حاليًّا. تحقق من إعدادات DeepSeek وحاول مجددًا.",
        },
        { status: 502 },
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-store, no-transform",
        Connection: "keep-alive",
        "X-Tutorly-Mode": "live",
      },
    });
  } catch (error) {
    console.error("Chat proxy failure:", error);
    return NextResponse.json(
      { error: "انقطع الاتصال بالمساعد. حاول مرة أخرى بعد قليل." },
      { status: 502 },
    );
  }
}
