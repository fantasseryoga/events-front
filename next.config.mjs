/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',  // The path you want to rewrite
        destination: 'http://localhost:4001/api/:path*',  // The destination URL
      },
    ];
  },
};

export default nextConfig;