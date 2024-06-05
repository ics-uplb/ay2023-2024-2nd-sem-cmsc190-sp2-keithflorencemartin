"use strict";

const methodsData = [
  { method: "rRNA sequence analysis" },
  { method: "Illumina next-generation screening" },
  { method: "Cultivation Method" },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("methods", methodsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("methods", null, {});
  },
};