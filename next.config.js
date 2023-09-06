
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // locales: ['en-US', 'fr', 'nl-NL'],
    // defaultLocale: 'en-US',
    swcMinify:false,
    locales: ['zh-CN', 'en-US'],
    defaultLocale: 'zh-CN',
  },

}

module.exports = nextConfig
