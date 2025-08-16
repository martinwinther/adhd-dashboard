/** @type {import('next').NextConfig} */
const nextConfig = {
	// Improve development server stability
	experimental: {
		// Reduce memory usage and improve stability
		optimizePackageImports: ['@heroicons/react'],
	},
	
	// Webpack configuration for better development experience
	webpack: (config, { dev, isServer }) => {
		if (dev && !isServer) {
			// Improve hot reloading
			config.watchOptions = {
				poll: 1000,
				aggregateTimeout: 300,
			};
		}
		return config;
	},
};

export default nextConfig;
