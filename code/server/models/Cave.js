const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database.js");
const Location = require("./Location.js"); // Import the Location model

const Cave = db.define(
  "Cave",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cave_code: {
      type: DataTypes.STRING,
    },
    cave_name: {
      type: DataTypes.STRING,
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: "caves",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

Cave.belongsTo(Location, {
  foreignKey: "location_id",
  onDelete: "NO ACTION",
  targetKey: "id",
});

module.exports = Cave;
