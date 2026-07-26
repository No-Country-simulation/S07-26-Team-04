import fs from "fs";
import path from "path";

export function getMdxMetadata(lang: string) {
  const filePath = path.join(
    process.cwd(),
    "content",
    `reporte-${lang.toUpperCase()}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, "utf-8");

  // Locate the metadata declaration
  const startIdx = content.indexOf("export const metadata =");
  if (startIdx === -1) {
    return null;
  }

  // Find the opening brace of the object
  const braceStart = content.indexOf("{", startIdx);
  if (braceStart === -1) {
    return null;
  }

  // Simple brace matching to extract the object literal
  let braceCount = 0;
  let braceEnd = -1;
  for (let i = braceStart; i < content.length; i++) {
    if (content[i] === "{") {
      braceCount++;
    } else if (content[i] === "}") {
      braceCount--;
    }

    if (braceCount === 0) {
      braceEnd = i;
      break;
    }
  }

  if (braceEnd === -1) {
    return null;
  }

  const objectString = content.substring(braceStart, braceEnd + 1);

  try {
    // Safely evaluate the object literal
    return new Function(`return ${objectString}`)();
  } catch (e) {
    console.error("Failed to parse MDX metadata object", e);
    return null;
  }
}
