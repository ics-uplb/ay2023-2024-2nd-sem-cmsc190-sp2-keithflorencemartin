const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database.js");

const Location = db.define(
  "Location",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    location_code: {
      type: DataTypes.STRING,
    },
    town: {
      type: DataTypes.STRING,
    },
    province: {
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
    tableName: "locations",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

module.exports = Location;
