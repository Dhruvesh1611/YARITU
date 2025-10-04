/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Isko true se false kar dein
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
        ],
    },
};

export default nextConfig;
