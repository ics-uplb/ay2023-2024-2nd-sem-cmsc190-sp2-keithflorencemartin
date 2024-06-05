"use strict";

const institutionsData = [
  { institution_code: "MNH", institution_name: "Museum of Natural History" },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("institutions", institutionsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("institutions", null, {});
  },
};