// Photo upload se pehle browser me hi chhota kar do (max 1024px, JPEG).
// 5-6 MB ki mobile photo ~150-300 KB ban jaati hai: upload tez, "File too large" error nahi.
export async function compressImage(file, { maxSize = 1024, quality = 0.82 } = {}) {
  if (!file?.type?.startsWith("image/") || file.type === "image/gif") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
  bitmap.close?.();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob || blob.size >= file.size) return file; // chhota na bane to original hi bhejo

  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}