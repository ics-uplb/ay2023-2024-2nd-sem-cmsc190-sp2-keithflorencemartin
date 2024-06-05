"use strict";

const cavesData = [
  { cave_code: "CURCC", cave_name: "Cavinti Underground River and Caves Complex", location_id: "1" },
  { cave_code: "CATHC", cave_name: "Underground Cathedral Cave", location_id: "1" },
  { cave_code: "SUNGC", cave_name: "Sungwan Cave", location_id: "2" },
  { cave_code: "KAMAC", cave_name: "Kamantigue Cave", location_id: "3" },
  { cave_code: "ANACC", cave_name: "Anacleta Cave", location_id: "4" },
  { cave_code: "ANILC", cave_name: "Anilon Cave", location_id: "5" },
  { cave_code: "BAHAC", cave_name: "Bahaga Cave", location_id: "4" },
  { cave_code: "BANTC", cave_name: "Bantakay Cave", location_id: "6" },
  { cave_code: "BATC", cave_name: "Bat Cave", location_id: "7" },
  { cave_code: "BONIC", cave_name: "Bonifacio Cave", location_id: "8" },
  { cave_code: "MACAC", cave_name: "Macabag Cave", location_id: "9" },
  { cave_code: "FORBC", cave_name: "Forbes Cave", location_id: "4" },
  { cave_code: "KAPIC", cave_name: "Kaping Cave", location_id: "2" },
  { cave_code: "KWEBA", cave_name: "Kwebang Puti", location_id: "1" },
  { cave_code: "LAWDC", cave_name: "Lawigue Dry Cave", location_id: "2" },
  { cave_code: "MAKAC", cave_name: "Makabag Cave", location_id: "10" },
  { cave_code: "MALUC", cave_name: "Malusak Cave", location_id: "6" },
  { cave_code: "MALVC", cave_name: "Malvida Cave", location_id: "8" },
  { cave_code: "MATAC", cave_name: "Matala Cave", location_id: "10" },
  { cave_code: "MINAC", cave_name: "Minalukan Cave", location_id: "1" },
  { cave_code: "PALAC", cave_name: "Palale Cave", location_id: "2" },
  { cave_code: "PAMIC", cave_name: "Pamitinan Cave", location_id: "7" },
  { cave_code: "PEÑAC", cave_name: "Peñaverde Cave", location_id: "4" },
  { cave_code: "PIITC", cave_name: "Piitan Cave", location_id: "10" },
  { cave_code: "BUGAC", cave_name: "Pinagbugahan Cave", location_id: "2" },
  { cave_code: "LUBUC", cave_name: "Pinaglubugan Cave", location_id: "2" },
  { cave_code: "SAYAC", cave_name: "Pinagsayawan Cave", location_id: "4" },
  { cave_code: "TINIC", cave_name: "Tinipak Cave", location_id: "11" },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await queryInterface.bulkInsert("caves", cavesData, {});
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("caves", null, {});
  },
};

