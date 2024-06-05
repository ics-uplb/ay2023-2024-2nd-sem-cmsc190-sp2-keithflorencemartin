const { Sequelize, DataTypes } = require("sequelize");
const db = require("../config/database.js");

const RolePermission = db.define(
  "role_has_permissions",
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    underscored: true,
    tableName: "role_has_permissions",
    timestamps: false,
  }
);

module.exports = RolePermission;
