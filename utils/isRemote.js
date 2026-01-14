// Returns true when the given URL is a remote resource (http(s)).
// Formerly also accepted Cloudinary-hosted URLs by checking a build-time env var;
// that env var has been removed during the S3 migration. Keep the check simple.
export default function isRemote(url) {
	if (!url) return false;
	try {
		if (typeof url !== 'string') return false;
		const u = url.trim();
		if (u.startsWith('http://') || u.startsWith('https://')) return true;
		if (u.startsWith('//')) return true; // protocol-relative
		if (u.includes('.amazonaws.com') || u.includes('cloudfront.net')) return true; // common S3/CDN
		if (u.startsWith('/')) return true; // root-relative (served by app/CDN)
	} catch (e) {
		// ignore errors and treat as not remote
	}
	return false;
}
