import type { NextConfig } from 'next'

const nextConfig: NextConfig = { reactStrictMode: true,
    allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.*.*.*', '*.local'],
}

export default nextConfig
