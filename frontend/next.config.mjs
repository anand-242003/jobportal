const nextConfig = {
  reactCompiler: true,
  async rewrites() {
    // Use environment variable for API URL, fallback to localhost for development
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
    // Remove /api suffix if present since we add it in the destination
    const baseUrl = apiUrl.replace(/\/api$/, '');
    
    return [
      {
        source: '/api/:path*',
        destination: `${baseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
