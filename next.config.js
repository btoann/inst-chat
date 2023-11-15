/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  distDir: 'dist',
  images: {
    domains: [
      'uploadthing.com',
      'utfs.io',
    ]
  }
}

module.exports = nextConfig