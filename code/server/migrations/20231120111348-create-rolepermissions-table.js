"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("role_has_permissions", {
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "roles",
          key: "id",
        },
        onDelete: "NO ACTION",
        allowNull: false,
      },
      permission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "permissions",
          key: "id",
        },
        onDelete: "NO ACTION",
        allowNull: false,
      },
    });

    await queryInterface.addIndex("roles", ["id"]);
    await queryInterface.addIndex("permissions", ["id"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("permissions");
  },
};
