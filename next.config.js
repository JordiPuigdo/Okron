
const path = require('path');

module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/src/',
        destination: '/',
        permanent: true,
      },
    ]
  },

}