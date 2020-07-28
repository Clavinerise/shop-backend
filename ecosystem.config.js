module.exports = {
    apps : [
        {
          name: "shop-backend",
          script: "./server.js",
          watch: true,
          env: {
              "NODE_ENV": "dev"
          },
          env_production: {
              "NODE_ENV": "production",
          }
        }
    ]
  }
