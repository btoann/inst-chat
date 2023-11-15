/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // distDir: 'build',
  images: {
    domains: [
      'uploadthing.com',
      'utfs.io',
    ]
  }
}

module.exports = nextConfig