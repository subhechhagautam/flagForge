/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  async headers() {
    return [
      {
        source: "/(.*)", // Apply headers to all routes
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "https://flagforge.aryan4.com.np",  
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' https://lh3.googleusercontent.com;",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer", // Other options: 'strict-origin', 'strict-origin-when-cross-origin'
          },
          {
            key: "Permissions-Policy",
            value:
              "geolocation=(), microphone=(), camera=(), payment=()", // Disable specific APIs
          },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate", // Security-oriented caching
          },
          {
            key: "Pragma",
            value: "no-cache", // Ensure no caching for older HTTP/1.0 clients
          },
          {
            key: "Server",
            value: "", // Hides the server header for security
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block", // Enable basic XSS protection
          },
        ],
      },
    ];
  },
};

export default nextConfig;


