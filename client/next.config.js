/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add the async rewrites method for proxying API requests
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Frontend requests start with /api/
        destination: 'http://localhost:5000/:path*', // Proxy to Express server
      },
    ];
  },
};

module.exports = nextConfig;