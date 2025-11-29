/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        // During local development we disable the Next.js image optimization proxy
        // to avoid timeouts when contacting remote CDNs like Cloudinary.
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co', // Yeh aapka purana wala hai
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com', // Yeh naya wala add karein
            },
        ],
    },
};

// Enable @next/bundle-analyzer when the ANALYZE env var is set to 'true'
// This keeps the normal config untouched and only wraps it for analysis builds.
let exported = nextConfig;
try {
    // dynamic import so this file still works if the package isn't installed
    const bundleAnalyzerPkg = await import('@next/bundle-analyzer');
    const bundleAnalyzer = bundleAnalyzerPkg.default || bundleAnalyzerPkg;
    const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
    exported = withBundleAnalyzer(nextConfig);
} catch (e) {
    // If bundle analyzer isn't installed or import fails, just export the base config.
    // We intentionally swallow the error here because analysis is optional.
}

export default exported;