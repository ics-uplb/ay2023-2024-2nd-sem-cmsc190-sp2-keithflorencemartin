require("dotenv").config();

const { Sequelize } = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require("./config")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
  }
);

// You need to use authenticate() instead of connect()
(async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database connected. [${env}]`);
  } catch (error) {
    console.error("Connection error:", error);
  }
})();

module.exports = sequelize;
