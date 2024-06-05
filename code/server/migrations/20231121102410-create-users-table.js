"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
        unique: true, // Ensure username uniqueness
      },
      email: {
        type: Sequelize.STRING,
        unique: true, // Ensure email uniqueness
      },
      password: {
        type: Sequelize.STRING,
      },
      role_name: {
        type: Sequelize.STRING,
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "roles",
          key: "id",
        },
        onDelete: "NO ACTION",
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });

    await queryInterface.addIndex("roles", ["role_name"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
