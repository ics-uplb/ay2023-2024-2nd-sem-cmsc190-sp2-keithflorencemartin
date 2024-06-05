const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database.js");

const Host = db.define(
  "Host",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    host_type: {
      type: DataTypes.STRING,
    },
    host_genus: {
      type: DataTypes.STRING,
    },
    host_species: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    deleted_at: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },

  {
    tableName: "hosts",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

module.exports = Host;
