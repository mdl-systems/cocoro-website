// PM2 Ecosystem Config — COCORO Website
// Usage:
//   pm2 start ecosystem.config.js           # start
//   pm2 restart cocoro-website              # restart
//   pm2 logs cocoro-website                 # logs
//   pm2 save && pm2 startup                 # auto-start on reboot

module.exports = {
  apps: [
    {
      name: "cocoro-website",

      // Standalone Next.js server (output: "standalone" in next.config.ts)
      script: ".next/standalone/server.js",

      // Working directory on server
      cwd: "/var/www/cocoro-website",

      // Number of instances (1 for now; increase for load balancing)
      instances: 1,

      // Auto-restart on crash
      autorestart: true,

      // Watch for file changes (disabled in production)
      watch: false,

      // Max memory before auto-restart
      max_memory_restart: "512M",

      // Restart delay on crash
      restart_delay: 3000,

      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },

      // Log files
      out_file: "/var/log/pm2/cocoro-website-out.log",
      error_file: "/var/log/pm2/cocoro-website-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // Merge logs from all instances
      merge_logs: true,
    },
  ],
};
