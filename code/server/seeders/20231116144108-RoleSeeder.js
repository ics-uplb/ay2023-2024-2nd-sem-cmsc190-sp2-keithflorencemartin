"use strict";

const rolesData = [
  { role_name: "Admin" },
  { role_name: "Researcher" },
  { role_name: "Guest" },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("roles", rolesData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("roles", null, {});
  },
};

