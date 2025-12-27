module.exports = {
  apps: [
    {
      script: "npm",
      args: "run start",
      cwd: "/root/blog/kblog-backend/api",
      env: {
        PORT: 3001,
      },
      watch: false,
      name: "kblog-api",
    },
    {
      script: "npm",
      arg: "run start",
      cwd: "/root/blog/kblog",
      env: {
        PORT: 3000,
      },
      watch: false,
      name: "kblog-front",
    },
    {
      script: "npm",
      arg: "run start",
      cwd: "/root/blog/kblog-backend/admin",
      env: {
        PORT: 3003,
      },
      watch: false,
      name: "kblog-admin",
    },
  ],
};
