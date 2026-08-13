export function getMarkdownField(
    content: string,
    field: string
): string | null {
    const regex = new RegExp(
        `\\*\\*${field}:\\*\\*\\s*(.+)`
    );

    return content.match(regex)?.[1]?.trim() ?? null;
}