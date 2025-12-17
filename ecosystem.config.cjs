module.exports = {
    apps: [{
        name: 'microsaas-manager',
        script: 'npm',
        args: 'run dev',
        cwd: '/Users/danilo/Downloads/MicroSaaSManager',
        env: {
            NODE_ENV: 'development',
            PORT: 4000,
            DATABASE_URL: 'postgresql://postgres.hlmlchllwwsyeceqcdin:noqse2-gagxoj-Sosfev@aws-1-us-east-1.pooler.supabase.com:5432/postgres',
            SESSION_SECRET: 'microsaas-manager-secret-key-2024-very-long-and-secure'
        },
        watch: false,
        autorestart: true,
        max_restarts: 10,
        restart_delay: 5000
    }]
};
