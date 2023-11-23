/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil'
    })
    return config
  },
  distDir: 'dist',
  images: {
    domains: [
      'uploadthing.com',
      'utfs.io',
    ]
  }
}

module.exports = nextConfig