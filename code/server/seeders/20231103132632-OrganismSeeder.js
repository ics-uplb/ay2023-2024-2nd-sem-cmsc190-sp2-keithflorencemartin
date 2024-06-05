"use strict";

const organismsData = [
  { organism_type: "Bacteria", value: "50000" },
  { organism_type: "Yeast", value: "60000" },
  { organism_type: "Molds", value: "70000" },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("organisms", organismsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("organisms", null, {});
  },
};
