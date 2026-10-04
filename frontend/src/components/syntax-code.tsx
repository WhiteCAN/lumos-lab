import { highlightCode, type CodeLanguage } from "@/lib/syntax-highlight";

export function SyntaxTokens({ code, language }: { code: string; language: CodeLanguage }) {
  return <span dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }} />;
}

export function SyntaxCode({ code, language, className = "", label = "코드 예제" }: {
  code: string;
  language?: CodeLanguage;
  className?: string;
  label?: string;
}) {
  return <div className={`syntax-highlight min-w-0 max-w-full ${className}`}>
    <pre tabIndex={0} aria-label={label} className="max-w-full overflow-auto rounded-lg border font-mono text-[13px] leading-6 focus-visible:outline-2 focus-visible:outline-ring">
      <code className="hljs" dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }} />
    </pre>
  </div>;
}
