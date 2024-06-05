"use strict";

const { query } = require("winston");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("isolate_infos", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      accession_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      code: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      genus: {
        type: Sequelize.STRING,
      },
      species: {
        type: Sequelize.STRING,
      },
      isolate_domain: {
        type: Sequelize.STRING,
      },
      isolate_phylum: {
        type: Sequelize.STRING,
      },
      isolate_class: {
        type: Sequelize.STRING,
      },
      isolate_order: {
        type: Sequelize.STRING,
      },
      isolate_family: {
        type: Sequelize.STRING,
      },
      organism_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "organisms",
          key: "id",
        },
        onDelete: "NO ACTION",
        allowNull: false,
      },
      sample_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "samples",
          key: "id",
        },
        onDelete: "NO ACTION",
        allowNull: false,
      },
      host_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "hosts",
          key: "id",
        },
        onDelete: "NO ACTION",
        allowNull: false,
      },
      method_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "methods",
          key: "id",
        },
        onDelete: "NO ACTION",
        allowNull: false,
      },
      cave_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "caves",
          key: "id",
        },
        onDelete: "NO ACTION",
        allowNull: false,
      },
      sampling_point_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "sampling_points",
          key: "id",
        },
        onDelete: "NO ACTION",
        allowNull: false,
      },
      institution_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "institutions",
          key: "id",
        },
        onDelete: "NO ACTION",
        allowNull: false,
      },
      collection_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "collections",
          key: "id",
        },
        onDelete: "NO ACTION",
        allowNull: false,
      },
      image_ref: {
        type: Sequelize.UUID,
        allowNull: true,
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
      access_level: {
        type: Sequelize.STRING,
      },
    });

    await queryInterface.addIndex("organisms", ["id"]);
    await queryInterface.addIndex("samples", ["id"]);
    await queryInterface.addIndex("hosts", ["id"]);
    await queryInterface.addIndex("methods", ["id"]);
    await queryInterface.addIndex("caves", ["id"]);
    await queryInterface.addIndex("sampling_points", ["id"]);
    await queryInterface.addIndex("institutions", ["id"]);
    await queryInterface.addIndex("collections", ["id"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("isolate_infos");
  },
};
