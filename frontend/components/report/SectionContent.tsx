import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SectionProps {
  content: string;
}

export default function SectionContent({ content }: SectionProps) {
  return (
    <div className="section-description">
      {/* Renderizado del contenido Markdown */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
