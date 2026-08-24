import { mdToHtml } from "../../lib/markdown";

interface MarkdownBodyProps {
  source: string;
  className?: string;
  justify?: boolean;
}

export default function MarkdownBody({ source, className = "", justify = false }: MarkdownBodyProps) {
  const html = mdToHtml(source || "");
  return (
    <div
      className={`font-sans font-medium text-body-lg text-ink/75 !leading-[1.65] max-w-none
        ${justify ? "sm:text-justify" : ""}
        [&>p]:mb-5 [&>p:last-child]:mb-0
        [&>h1]:font-serif [&>h1]:text-h2 [&>h1]:text-ink [&>h1]:mt-10 [&>h1]:mb-4
        [&>h2]:font-serif [&>h2]:text-h3 [&>h2]:text-ink [&>h2]:mt-8 [&>h2]:mb-3
        [&>h3]:font-serif [&>h3]:text-h4 [&>h3]:text-ink [&>h3]:mt-6 [&>h3]:mb-2
        [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul>li]:mb-1
        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>ol>li]:mb-1
        [&>blockquote]:border-l-2 [&>blockquote]:border-ink/20 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-ink/70 [&>blockquote]:my-5
        [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-2
        [&_strong]:text-ink [&_strong]:font-semibold
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
