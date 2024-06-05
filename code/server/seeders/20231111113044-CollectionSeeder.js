"use strict";

const collectionsData = [
  { collection_code: "MCC", collection_name: "Microbial Culture Collection" },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("collections", collectionsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("collections", null, {});
  },
};
