export async function hashFile(file: File, purpose: string = ""): Promise<string> {
  const buffer = await file.arrayBuffer();
  
  // Combine file and purpose for unique identity per purpose
  // If purpose is empty, it acts like the original hash (mostly) but we should be consistent
  // Strategy: Concatenate bytes + separator + purpose bytes
  
  const purposeEncoder = new TextEncoder();
  const purposeData = purposeEncoder.encode("|" + purpose.trim());
  
  const combined = new Uint8Array(buffer.byteLength + purposeData.length);
  combined.set(new Uint8Array(buffer), 0);
  combined.set(purposeData, buffer.byteLength);

  const hashBuffer = await crypto.subtle.digest("SHA-256", combined);

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
