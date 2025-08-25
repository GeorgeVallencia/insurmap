
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable Turbopack to prevent memory issues
  experimental: {
    // Reduce memory usage during development
    workerThreads: false,
    cpus: 1,
  },

  // Optimize webpack bundle
  webpack: (config, { isServer, dev }) => {
    // Client-side optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Reduce bundle size in development
      if (dev) {
        config.optimization = {
          ...config.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
              mapbox: {
                test: /[\\/]node_modules[\\/]mapbox-gl[\\/]/,
                name: 'mapbox',
                chunks: 'all',
                priority: 10,
              },
            },
          },
        };
      }
    }

    return config;
  },

  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },

  // Reduce memory usage
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     // Reduce memory usage
//     workerThreads: false,
//     cpus: 1,
//   },
//   // Optimize bundle
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       // Reduce client-side bundle size
//       config.resolve.fallback = {
//         ...config.resolve.fallback,
//         fs: false,
//         net: false,
//         tls: false,
//       };
//     }
//     return config;
//   },
// };

// module.exports = nextConfig;