// Client helper to request a presigned PUT URL and upload directly to S3 with progress
export default async function uploadFileWithPresign(file, folder = 'YARITU/misc', onProgress) {
  if (!file) throw new Error('No file provided');

  // Request presigned URL from our server route
  let presignRes;
  try {
    presignRes = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name, folder, contentType: file.type, size: file.size }),
    });
  } catch (err) {
    throw new Error('Failed to request presigned URL: ' + (err?.message || err));
  }

  if (!presignRes.ok) {
    const txt = await presignRes.text().catch(() => null);
    throw new Error('Presign request failed: ' + presignRes.status + ' ' + (presignRes.statusText || '') + ' ' + (txt || ''));
  }

  const presignJson = await presignRes.json().catch(() => null);
  if (!presignJson || !presignJson.signedUrl) {
    throw new Error('Presign response missing signedUrl');
  }

  const { signedUrl, key, publicUrl } = presignJson;

  // Upload file bytes directly to S3 using XHR so we can report progress
  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedUrl, true);
    // Set content-type so S3 stores correct metadata
    try { xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream'); } catch (e) { /* some browsers disallow setting */ }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.round((event.loaded * 100) / event.total);
        try { onProgress(percent); } catch (e) { /* swallow */ }
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error('Upload failed with status ' + xhr.status));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(file);
  });

  // publicUrl should be provided by server. If not, derive by stripping query from signedUrl
  const finalUrl = publicUrl || (signedUrl ? signedUrl.split('?')[0] : null);
  return { publicUrl: finalUrl, key };
}
