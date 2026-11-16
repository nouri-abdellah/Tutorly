"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  Copy,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { useProgress } from "./providers";
import { ChapterIcon } from "./chapter-icon";
import { MathMarkdown } from "./math";

export type ChatContext = {
  title: string;
  chapterTitle: string;
  chapterSlug: string;
  accent: string;
  icon: string;
  lessonId?: string;
};

export type ChatChapterOption = {
  slug: string;
  title: string;
  accent: string;
  icon: string;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
};

const STORAGE_KEY = "tutorly:chat:v1";
const MAX_STORED_MESSAGES = 40;
const subscribeToHydration = () => () => {};

function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readStoredMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is Message =>
        item &&
        typeof item.id === "string" &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string",
    );
  } catch {
    return [];
  }
}

const generalSuggestions = [
  "اشرح لي النهايات ببساطة",
  "كيف أحل معادلة من الدرجة الثانية؟",
  "ما هي الأعداد المركبة؟",
  "أعطني خطة مراجعة للبكالوريا",
];

const lessonSuggestions = [
  "اشرح لي أهم فكرة في هذا الدرس",
  "أعطني مثالًا محلولًا خطوة بخطوة",
  "ما الأخطاء الشائعة التي يجب تجنبها هنا؟",
  "اختبرني بسؤال قصير على هذا الدرس",
];

export function ChatShell({
  initialContext,
  chapterOptions,
}: {
  initialContext: ChatContext | null;
  chapterOptions: ChatChapterOption[];
}) {
  const { user } = useProgress();
  const [messages, setMessages] = useState<Message[]>(readStoredMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const [context, setContext] = useState<ChatContext | null>(initialContext);
  const [demoMode, setDemoMode] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const streamingRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)),
      );
    } catch {
      // Ignore storage limits.
    }
  }, [messages, hydrated]);

  useEffect(() => {
    if (!stickToBottom.current) return;
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, streaming]);

  const scrollToBottom = () => {
    stickToBottom.current = true;
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  };

  const requestAnswer = useCallback(
    async (history: Message[]) => {
      if (streamingRef.current) return;
      streamingRef.current = true;
      setStreaming(true);
      setDemoMode(false);
      const assistantId = makeId();

      setMessages([
        ...history,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      const controller = new AbortController();
      abortRef.current = controller;

      const updateAssistant = (content: string, error = false) => {
        setMessages((previous) =>
          previous.map((message) =>
            message.id === assistantId
              ? { ...message, content, error }
              : message,
          ),
        );
      };

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history
              .slice(-20)
              .filter((message) => message.content.trim().length > 0)
              .map((message) => ({
                role: message.role,
                content: message.content,
              })),
            lessonContext: context
              ? { title: context.title, chapter: context.chapterTitle }
              : undefined,
          }),
          signal: controller.signal,
        });

        const mode = response.headers.get("X-Tutorly-Mode");
        if (mode === "demo") setDemoMode(true);

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          updateAssistant(
            data?.error ?? "تعذر الحصول على إجابة الآن. حاول مرة أخرى.",
            true,
          );
          return;
        }

        const contentType = response.headers.get("Content-Type") ?? "";

        if (contentType.includes("text/plain")) {
          const text = await response.text();
          updateAssistant(text);
          return;
        }

        if (!response.body) {
          updateAssistant("لم يصل أي محتوى من المساعد.", true);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newline = buffer.indexOf("\n");
          while (newline !== -1) {
            const line = buffer.slice(0, newline).replace(/\r$/, "").trim();
            buffer = buffer.slice(newline + 1);
            newline = buffer.indexOf("\n");

            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;

            try {
              const payload = JSON.parse(data) as {
                choices?: { delta?: { content?: string } }[];
                error?: { message?: string };
              };
              if (payload.error?.message) {
                throw new Error(payload.error.message);
              }
              const delta = payload.choices?.[0]?.delta?.content;
              if (typeof delta === "string" && delta.length > 0) {
                accumulated += delta;
                updateAssistant(accumulated);
              }
            } catch (error) {
              if (error instanceof SyntaxError) continue;
              throw error;
            }
          }
        }

        if (!accumulated.trim()) {
          updateAssistant(
            "لم يصل نص الإجابة. تحقق من اتصال الإنترنت وحاول مجددًا.",
            true,
          );
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setMessages((previous) => {
            const target = previous.find((message) => message.id === assistantId);
            if (!target || !target.content.trim()) {
              return previous.filter((message) => message.id !== assistantId);
            }
            return previous;
          });
        } else {
          updateAssistant(
            "حدث خطأ أثناء الاتصال بالمساعد. تحقق من اتصالك ثم حاول مجددًا.",
            true,
          );
        }
      } finally {
        streamingRef.current = false;
        abortRef.current = null;
        setStreaming(false);
        window.setTimeout(scrollToBottom, 40);
      }
    },
    [context],
  );

  const send = useCallback(
    (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text || streamingRef.current) return;
      const userMessage: Message = { id: makeId(), role: "user", content: text };
      const history = [...messages, userMessage];
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      scrollToBottom();
      void requestAnswer(history);
    },
    [input, messages, requestAnswer],
  );

  const stop = () => {
    abortRef.current?.abort();
  };

  const regenerate = () => {
    if (streamingRef.current) return;
    const lastAssistant = [...messages]
      .reverse()
      .find((message) => message.role === "assistant");
    if (!lastAssistant) return;
    const index = messages.findIndex((message) => message.id === lastAssistant.id);
    const history = messages.slice(0, index);
    if (!history.some((message) => message.role === "user")) return;
    void requestAnswer(history);
  };

  const clearChat = () => {
    if (messages.length === 0) return;
    if (!window.confirm("هل تريد بدء محادثة جديدة؟ ستُحذف المحادثة الحالية.")) {
      return;
    }
    abortRef.current?.abort();
    setMessages([]);
    setDemoMode(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore.
    }
  };

  const copyMessage = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // Clipboard might be unavailable.
    }
  };

  const chooseChapter = (slug: string) => {
    if (!slug) {
      setContext(null);
      return;
    }
    const chapter = chapterOptions.find((item) => item.slug === slug);
    if (!chapter) return;
    setContext({
      title: `مراجعة محور ${chapter.title}`,
      chapterTitle: chapter.title,
      chapterSlug: chapter.slug,
      accent: chapter.accent,
      icon: chapter.icon,
    });
  };

  const suggestions = context?.lessonId ? lessonSuggestions : generalSuggestions;
  const lastMessage = messages[messages.length - 1];
  const canRegenerate =
    !streaming &&
    lastMessage?.role === "assistant" &&
    messages.some((message) => message.role === "user");

  return (
    <div className="container-page py-4 lg:py-5">
      <div className="grid h-[calc(100dvh-6.5rem)] min-h-[560px] gap-4 lg:grid-cols-[290px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="surface hidden flex-col overflow-hidden lg:flex">
          <div className="border-b border-line/70 p-5">
            <div className="flex items-center gap-3">
              <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-lg shadow-brand/20">
                <Sparkles className="h-5 w-5" />
                <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full bg-mint ring-2 ring-white" />
              </span>
              <div>
                <h1 className="text-base font-extrabold text-ink">مساعد Tutorly</h1>
                <p className="text-[0.68rem] font-medium text-ink-soft">
                  أستاذ رياضياتك، متاح دائمًا
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-4 chat-scroll">
            <div>
              <p className="px-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft/60">
                سياق الإجابة
              </p>
              {context ? (
                <div
                  className="mt-2 rounded-2xl border p-3"
                  style={{
                    borderColor: `color-mix(in srgb, ${context.accent} 25%, white)`,
                    background: `color-mix(in srgb, ${context.accent} 6%, white)`,
                  }}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white"
                      style={{ color: context.accent }}
                    >
                      <ChapterIcon name={context.icon} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.62rem] font-bold text-ink-soft">
                        {context.lessonId ? "الدرس الحالي" : "المحور المحدد"}
                      </p>
                      <p className="mt-0.5 text-[0.75rem] font-extrabold leading-5 text-ink">
                        {context.title}
                      </p>
                      {context.lessonId && (
                        <p className="mt-0.5 text-[0.62rem] text-ink-soft">
                          {context.chapterTitle}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setContext(null)}
                      className="text-ink-soft/50 transition hover:text-ink"
                      aria-label="إزالة السياق"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 rounded-xl bg-ink/[0.03] p-3 text-[0.68rem] leading-5 text-ink-soft">
                  لم تحدد سياقًا. اختر محورًا لتصبح الإجابات مرتبطة بدرسك.
                </p>
              )}

              <div className="relative mt-2">
                <select
                  value={context?.chapterSlug ?? ""}
                  onChange={(event) => chooseChapter(event.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-line bg-white px-3 pe-8 text-[0.72rem] font-semibold text-ink-soft focus:border-brand/40 focus:outline-none"
                  aria-label="اختر محورًا كسياق للمحادثة"
                >
                  <option value="">بدون سياق محدد</option>
                  {chapterOptions.map((chapter) => (
                    <option key={chapter.slug} value={chapter.slug}>
                      {chapter.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute end-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
              </div>
            </div>

            <div>
              <p className="px-1 text-[0.65rem] font-bold uppercase tracking-wide text-ink-soft/60">
                اقتراحات سريعة
              </p>
              <div className="mt-2 space-y-1.5">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    disabled={streaming}
                    className="flex w-full items-start gap-2 rounded-xl border border-transparent px-2.5 py-2 text-start text-[0.72rem] font-medium leading-5 text-ink-soft transition hover:border-line hover:bg-white hover:text-ink disabled:opacity-50"
                  >
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand/70" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-line/70 bg-[#fbf9f4] p-3.5">
              <p className="flex items-center gap-1.5 text-[0.68rem] font-extrabold text-ink">
                <BrainCircuit className="h-3.5 w-3.5 text-brand" />
                كيف تستفيد أكثر؟
              </p>
              <p className="mt-1.5 text-[0.68rem] leading-5 text-ink-soft">
                اكتب سؤالك بتفصيل، وأرفق المعطيات. يمكنك طلب شرح، تصحيح حلّك،
                أو تمرين إضافي.
              </p>
            </div>
          </div>

          <div className="border-t border-line/70 p-3">
            <button
              type="button"
              onClick={clearChat}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[0.72rem] font-bold text-ink-soft transition hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" />
              محادثة جديدة
            </button>
            <p className="mt-1 text-center text-[0.58rem] leading-4 text-ink-soft/50">
              Tutorly قد يخطئ. تحقق دائمًا من الإجابة.
            </p>
          </div>
        </aside>

        {/* Chat area */}
        <section className="surface-solid flex min-h-0 flex-col overflow-hidden">
          <header className="flex flex-none items-center justify-between gap-3 border-b border-line/70 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep text-white">
                <Sparkles className="h-4 w-4" />
                <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-mint ring-2 ring-white" />
              </span>
              <div>
                <p className="text-[0.85rem] font-extrabold text-ink">
                  مساعد Tutorly
                </p>
                <p className="flex items-center gap-1 text-[0.62rem] font-medium text-mint">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                  متصل · DeepSeek
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {context && (
                <span
                  className="hidden max-w-[13rem] items-center gap-1.5 truncate rounded-full border px-2.5 py-1 text-[0.62rem] font-bold sm:flex"
                  style={{
                    color: context.accent,
                    borderColor: `color-mix(in srgb, ${context.accent} 25%, white)`,
                    background: `color-mix(in srgb, ${context.accent} 7%, white)`,
                  }}
                >
                  <ChapterIcon name={context.icon} className="h-3 w-3" />
                  <span className="truncate">{context.title}</span>
                </span>
              )}
              <button
                type="button"
                onClick={clearChat}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft/60 transition hover:bg-ink/5 hover:text-ink"
                aria-label="محادثة جديدة"
                title="محادثة جديدة"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex flex-none items-center gap-2 border-b border-line/70 bg-[#fbf9f4] px-4 py-2 lg:hidden">
            <span className="shrink-0 text-[0.62rem] font-bold text-ink-soft">
              سياق الإجابة
            </span>
            <div className="relative min-w-0 flex-1">
              <select
                value={context?.chapterSlug ?? ""}
                onChange={(event) => chooseChapter(event.target.value)}
                className="h-8 w-full appearance-none rounded-lg border border-line bg-white px-2.5 pe-7 text-[0.68rem] font-semibold text-ink-soft focus:border-brand/40 focus:outline-none"
                aria-label="اختر محورًا كسياق للمحادثة"
              >
                <option value="">بدون سياق محدد</option>
                {chapterOptions.map((chapter) => (
                  <option key={chapter.slug} value={chapter.slug}>
                    {chapter.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-soft/50" />
            </div>
            {context && (
              <button
                type="button"
                onClick={() => setContext(null)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ink-soft/60 transition hover:bg-ink/5 hover:text-ink"
                aria-label="إزالة السياق"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {demoMode && (
            <div className="flex flex-none items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2 text-[0.68rem] font-semibold text-amber-800">
              <span className="rounded bg-amber-200/60 px-1.5 py-0.5 text-[0.6rem] font-extrabold">
                وضع تجريبي
              </span>
              أضف مفتاح DEEPSEEK_API_KEY لتفعيل الإجابات الحية.
            </div>
          )}

          <div
            ref={scrollRef}
            onScroll={() => {
              const node = scrollRef.current;
              if (!node) return;
              stickToBottom.current =
                node.scrollHeight - node.scrollTop - node.clientHeight < 120;
            }}
            className="chat-scroll flex-1 overflow-y-auto px-4 py-5 sm:px-6"
          >
            {!hydrated || messages.length === 0 ? (
              <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center py-6 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-brand to-brand-deep text-white shadow-xl shadow-brand/25">
                  <Sparkles className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-2xl font-extrabold text-ink">
                  أهلًا{user ? ` ${user.name}` : ""}! كيف أساعدك؟
                </h2>
                <p className="mt-2 max-w-md text-[0.85rem] leading-7 text-ink-soft">
                  أنا مساعدك في رياضيات البكالوريا. اسأل عن أي درس، تمرين، أو
                  فكرة — وسأشرحها لك خطوة بخطوة بالعربية.
                </p>

                {context && (
                  <div className="mt-4 flex max-w-full items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[0.68rem] font-semibold text-ink-soft">
                    <ChapterIcon name={context.icon} className="h-3.5 w-3.5" />
                    <span className="truncate">السياق: {context.title}</span>
                  </div>
                )}

                <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => send(suggestion)}
                      className="group flex items-center gap-2 rounded-xl border border-line bg-white/70 px-3.5 py-3 text-start text-[0.75rem] font-semibold text-ink-soft transition hover:border-brand/30 hover:bg-white hover:text-ink"
                    >
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand/60 transition group-hover:text-brand" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-2xl space-y-5">
                {messages.map((message) =>
                  message.role === "user" ? (
                    <div key={message.id} className="flex justify-start">
                      <div className="max-w-[88%] rounded-2xl rounded-se-md bg-ink px-4 py-3 text-[0.86rem] leading-7 text-white">
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={message.id} className="flex items-start gap-3">
                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-deep text-white">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div
                          className={`rounded-2xl rounded-ss-md border px-4 py-3.5 ${
                            message.error
                              ? "border-red-200 bg-red-50"
                              : "border-line/80 bg-[#fbfaf6]"
                          }`}
                        >
                          {message.content ? (
                            message.error ? (
                              <p className="text-[0.82rem] leading-6 text-red-700">
                                {message.content}
                              </p>
                            ) : (
                              <MathMarkdown
                                content={message.content}
                                variant="chat"
                              />
                            )
                          ) : (
                            <div className="flex items-center gap-1.5 py-1">
                              <span className="typing-dot" />
                              <span className="typing-dot" />
                              <span className="typing-dot" />
                            </div>
                          )}
                        </div>

                        {message.content && !message.error && (
                          <div className="mt-1.5 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => void copyMessage(message)}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[0.62rem] font-semibold text-ink-soft/60 transition hover:bg-ink/5 hover:text-ink"
                            >
                              {copiedId === message.id ? (
                                <>
                                  <Check className="h-3 w-3 text-mint" />
                                  تم النسخ
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  نسخ
                                </>
                              )}
                            </button>
                            {message.id === lastMessage?.id && canRegenerate && (
                              <button
                                type="button"
                                onClick={regenerate}
                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[0.62rem] font-semibold text-ink-soft/60 transition hover:bg-ink/5 hover:text-ink"
                              >
                                <RotateCcw className="h-3 w-3" />
                                إعادة المحاولة
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          <div className="flex-none border-t border-line/70 bg-[#fffdf8] p-3 sm:p-4">
            <div className="mx-auto max-w-2xl">
              <div className="flex items-end gap-2 rounded-2xl border border-line bg-white p-2 transition focus-within:border-brand/40 focus-within:ring-4 focus-within:ring-brand/10">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    const node = event.target;
                    node.style.height = "auto";
                    node.style.height = `${Math.min(node.scrollHeight, 150)}px`;
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder="اسأل عن أي درس، تمرين، أو فكرة رياضية…"
                  className="max-h-[150px] min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-2 text-[0.85rem] leading-6 text-ink placeholder:text-ink-soft/45 focus:outline-none"
                  aria-label="رسالتك إلى المساعد"
                  disabled={streaming}
                />
                {streaming ? (
                  <button
                    type="button"
                    onClick={stop}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-white transition hover:bg-red-600"
                    aria-label="إيقاف الإجابة"
                  >
                    <Square className="h-4 w-4 fill-current" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => send()}
                    disabled={!input.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-ink/15"
                    aria-label="إرسال"
                  >
                    <Send className="h-4 w-4 -scale-x-100" />
                  </button>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-1 px-1 text-[0.6rem] text-ink-soft/55">
                <span>Enter للإرسال · Shift+Enter لسطر جديد</span>
                <Link
                  href="/lessons"
                  className="flex items-center gap-1 font-semibold text-brand hover:text-brand-deep"
                >
                  <BookOpen className="h-3 w-3" />
                  تصفح الدروس
                  <ArrowLeft className="h-2.5 w-2.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <p className="mt-2 text-center text-[0.62rem] text-ink-soft/50 lg:hidden">
        المساعد قد يخطئ — تحقق دائمًا من إجاباتك في الدروس.
      </p>
    </div>
  );
}
