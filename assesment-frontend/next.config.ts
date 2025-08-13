module.exports = {
  async redirects() {
    return [
      { source: '/auth/login', destination: '/login', permanent: false },
    ];
  },
  eslint: {
    // Permite que el build continúe aunque haya errores de ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Permite que el build continúe aunque haya errores de TypeScript
    ignoreBuildErrors: true,
  },
};

