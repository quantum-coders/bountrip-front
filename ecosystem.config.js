module.exports = {
	apps: [
		{
			name: 'bountrip-front',
			port: '1555',
			exec_mode: 'cluster',
			instances: 1,
			script: './.output/server/index.mjs',
		},
	],
};
