module.exports = {
  async redirects() {
    return [
      { source: '/auth/login', destination: '/login', permanent: false },
    ];
  },
};
