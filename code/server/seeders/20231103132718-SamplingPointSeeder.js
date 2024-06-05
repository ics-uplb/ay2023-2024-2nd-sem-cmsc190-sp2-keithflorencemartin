"use strict";

const samplingPointsData = [
  { description: "Isolate found near a distinctive rocky formation within the cave." },
  { description: "Isolate discovered in a dark and enclosed chamber of the cave." },
  { description: "Isolate found near a ventilation shaft, possibly indicating airflow within the cave." },
  { description: "Isolate collected at the point where an underground river enters the cave." },
  { description: "Isolate sampled in an area known for bat roosting within the cave." },
];


module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await queryInterface.bulkInsert("sampling_points", samplingPointsData, {});
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("sampling_points", null, {});
  },
};

