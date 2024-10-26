

export function toBase64(str: string) {
    const buffer = Buffer.from(str, "utf-8");
    return buffer.toString("base64");
}

export function fromBase64(base64Str: string) {
    const buffer = Buffer.from(base64Str, "base64");
    return buffer.toString();
}