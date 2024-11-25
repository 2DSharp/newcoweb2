/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'newco2024-dev.s3.amazonaws.com'
      // Add other image domains as needed
    ],
  },
}

module.exports = nextConfig