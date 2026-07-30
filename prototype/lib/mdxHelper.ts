import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function getMdxMetadata(lang: string) {
  const filePath = path.join(
    process.cwd(),
    "content",
    `reporte-${lang.toUpperCase()}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");

  try {
    const { data } = matter(fileContent);
    return data;
  } catch (e) {
    console.error("Failed to parse MDX frontmatter using gray-matter", e);
    return null;
  }
}
