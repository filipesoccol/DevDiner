export function slugifyString(input: string): string {
    return input
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase()
        .substring(0, 50);
}