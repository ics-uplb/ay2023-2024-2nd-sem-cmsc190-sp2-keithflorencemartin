"use strict";

const samplesData = [
  { sample_type: "Gut" },
  { sample_type: "Bat Rinse" },
  { sample_type: "Guano" },
  { sample_type: "Fresh Guano" },
  { sample_type: "Water" },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("samples", samplesData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("samples", null, {});
  },
};

