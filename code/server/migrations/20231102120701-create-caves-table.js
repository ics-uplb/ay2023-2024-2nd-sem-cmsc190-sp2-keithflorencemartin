"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("caves", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cave_code: {
        type: Sequelize.STRING,
      },
      cave_name: {
        type: Sequelize.STRING,
      },
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "locations",
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

    await queryInterface.addIndex("locations", ["id"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("caves");
  },
};
