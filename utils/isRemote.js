// Returns true when the given URL is a remote resource (http(s)).
// Formerly also accepted Cloudinary-hosted URLs by checking a build-time env var;
// that env var has been removed during the S3 migration. Keep the check simple.
export default function isRemote(url) {
	if (!url) return false;
	try {
		if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) return true;
	} catch (e) {
		// ignore errors and treat as not remote
	}
	return false;
}
