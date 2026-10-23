import crypto from 'crypto';

export async function destroyImage(publicId) {
  const ts = Math.floor(Date.now() / 1000);
  const sig = crypto.createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${ts}${process.env.CLOUDINARY_API_SECRET}`)
    .digest('hex');
  await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`, {
    method: 'POST',
    body: new URLSearchParams({
      public_id: publicId,
      timestamp: ts,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      signature: sig,
    }),
  }).catch(() => {});
}