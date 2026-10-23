export async function uploadImage(file) {
  const sg = await (await fetch('/api/sign')).json();
  const fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
  fd.append('timestamp', sg.timestamp);
  fd.append('signature', sg.signature);
  fd.append('folder', sg.folder);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: fd });
  const d = await r.json();
  if (!d.secure_url) throw new Error(d.error?.message || 'Upload failed');
  return { url: d.secure_url, publicId: d.public_id };
}