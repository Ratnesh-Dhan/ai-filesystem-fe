/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        // Variables available on both client and server
        NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'development' 
          ? process.env.NEXT_PUBLIC_LOCAL_API_URL 
          : process.env.NEXT_PUBLIC_PRODUCTION_API_URL,
      },
};

export default nextConfig;
