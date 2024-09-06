module.exports = {
    apps: [
        {
            name: 'rollup-service',
            cwd: './rollup',
            script: 'bun',
            args: 'start',
            watch: true,
            env: {
                NODE_ENV: 'development',
            },
        },
        {
            name: 'app-service',
            script: 'bun',
            args: 'dev',
            watch: true,
            env: {
                NODE_ENV: 'development',
            },
        },
    ],
};