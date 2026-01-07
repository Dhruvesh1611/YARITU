/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        // Enable Next.js image optimization for faster loading
        unoptimized: false,
        // Use modern formats for better compression
        formats: ['image/avif', 'image/webp'],
        // Configure allowed quality values
        qualities: [75, 85, 90],
        // Allow SVG images
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        // Minimize layout shift
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: '*.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: '*.s3.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: '*.s3.*.amazonaws.com',
            },
        ],
    },
    // Enable compression
    compress: true,
    // Optimize production builds
    swcMinify: true,
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