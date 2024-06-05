"use strict";

const locationsData = [
  { location_code: "CL", town: "Cavinti", province: "Laguna" },
  { location_code: "TQ", town: "Tayabas", province: "Quezon" },
  { location_code: "LB", town: "Lobo", province: "Batangas" },
  { location_code: "MQ", town: "Mulanay", province: "Quezon" },
  { location_code: "BQ", town: "Burdeos", province: "Quezon" },
  { location_code: "AQ", town: "Atimonan", province: "Quezon" },
  { location_code: "RR", town: "Rodriguez", province: "Rizal" },
  { location_code: "UQ", town: "Unisan", province: "Quezon" },
  { location_code: "MC", town: "Maragondon", province: "Cavite" },
  { location_code: "IC", town: "Indang", province: "Cavite" },
  { location_code: "TR", town: "Tanay", province: "Rizal" },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("locations", locationsData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("locations", null, {});
  },
};

