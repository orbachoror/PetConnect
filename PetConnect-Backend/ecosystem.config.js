module.exports = {
  apps: [{
    name: "PetConnect",
    script: "./dist/src/server.js",
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}
