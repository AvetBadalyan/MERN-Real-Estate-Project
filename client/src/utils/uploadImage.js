export async function uploadImage(file) {
  const data = new FormData();
  data.append("image", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: data,
  });
  const result = await res.json().catch(() => ({}));

  if (!res.ok || result.success === false) {
    throw new Error(result.message || "Image upload failed");
  }

  return result.imageUrl;
}