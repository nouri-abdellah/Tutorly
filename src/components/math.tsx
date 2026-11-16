import ReactMarkdown, { type Components } from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import katex from "katex";

const components: Components = {
  table({ children, ...props }) {
    return (
      <div className="my-5 overflow-x-auto rounded-xl">
        <table {...props}>{children}</table>
      </div>
    );
  },
  a({ href, children, ...props }) {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
};

export function MathMarkdown({
  content,
  variant = "lesson",
  className = "",
}: {
  content: string;
  variant?: "lesson" | "chat";
  className?: string;
}) {
  return (
    <div
      className={`${variant === "chat" ? "prose-chat" : "lesson-prose"} ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function Formula({
  latex,
  display = false,
  className = "",
}: {
  latex: string;
  display?: boolean;
  className?: string;
}) {
  let html = "";
  try {
    html = katex.renderToString(latex, {
      displayMode: display,
      throwOnError: false,
      strict: false,
      output: "html",
    });
  } catch {
    html = latex;
  }

  return (
    <span
      className={className}
      dir="ltr"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
