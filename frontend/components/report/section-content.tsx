import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SectionProps {
  content: string;
}

export default function SectionContent({ content }: SectionProps) {
  return (
    <div className="section-description space-y-3">
      {/* Renderizado del contenido Markdown con tipografía refinada */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="text-[#ecc246] font-serif text-lg sm:text-xl font-semibold mt-2 mb-3 leading-snug tracking-normal">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[#f4f1e8] font-serif text-base sm:text-lg font-medium mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-body-md text-[#e5e2da]/90 leading-relaxed my-2">
              {children}
            </p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-2 border-[#c9a227] bg-[#0b3d2e]/70 px-4 py-3 rounded-r text-sm italic text-[#e5e2da] shadow-sm">
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
            <ul className="space-y-1.5 my-3 list-disc list-inside text-body-md text-[#e5e2da]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-3 list-decimal list-inside text-body-md text-[#e5e2da]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-body-md leading-relaxed">{children}</li>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
