import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SectionProps {
  content: string;
}

export default function SectionContent({ content }: SectionProps) {
  return (
    <div className="section-description space-y-3 font-sans">
      {/* Renderizado del contenido Markdown con estilo Tech Modern (Stripe / OpenAI) */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="text-[#e5e2da] font-sans text-xl sm:text-2xl font-semibold italic mt-2 mb-4 leading-snug tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[#f4f1e8] font-sans text-lg sm:text-xl font-bold mt-5 mb-2 tracking-tight">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="font-sans text-base sm:text-[17px] text-[#e5e2da]/90 leading-relaxed my-2 font-normal">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-2 border-[#c9a227] bg-[#0b3d2e]/80 px-4 py-3 rounded-r text-xs sm:text-sm italic text-[#e5e2da]/85 leading-relaxed shadow-sm font-sans">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#ecc246]/90">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-3 list-disc list-inside font-sans text-base text-[#e5e2da]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-3 list-decimal list-inside font-sans text-base text-[#e5e2da]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="font-sans text-base leading-relaxed">{children}</li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
