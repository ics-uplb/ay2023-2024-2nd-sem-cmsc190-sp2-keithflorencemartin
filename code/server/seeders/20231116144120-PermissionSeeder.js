"use strict";

const permissionsData = [
  { perm_name: "create_isolate_info" },
  { perm_name: "read_isolate_info" },
  { perm_name: "update_isolate_info" },
  { perm_name: "delete_isolate_info" },
  { perm_name: "create_location" },
  { perm_name: "read_location" },
  { perm_name: "update_location" },
  { perm_name: "delete_location" },
  { perm_name: "create_cave" },
  { perm_name: "read_cave" },
  { perm_name: "update_cave" },
  { perm_name: "delete_cave" },
  { perm_name: "create_organism" },
  { perm_name: "read_organism" },
  { perm_name: "update_organism" },
  { perm_name: "delete_organism" },
  { perm_name: "create_sample" },
  { perm_name: "read_sample" },
  { perm_name: "update_sample" },
  { perm_name: "delete_sample" },
  { perm_name: "create_sampling_point" },
  { perm_name: "read_sampling_point" },
  { perm_name: "update_sampling_point" },
  { perm_name: "delete_sampling_point" },
  { perm_name: "create_host" },
  { perm_name: "read_host" },
  { perm_name: "update_host" },
  { perm_name: "delete_host" },
  { perm_name: "create_user" },
  { perm_name: "read_user" },
  { perm_name: "update_user" },
  { perm_name: "delete_user" },
  { perm_name: "create_method" },
  { perm_name: "read_method" },
  { perm_name: "update_method" },
  { perm_name: "delete_method" },
  { perm_name: "add_admin" },
  { perm_name: "change_password" },
  { perm_name: "read_institution" },
  { perm_name: "read_collection" },
  { perm_name: "update_institution" },
  { perm_name: "update_collection" },
  { perm_name: "delete_institution" },
  { perm_name: "delete_collection" },
  { perm_name: "create_institution" },
  { perm_name: "create_collection" },
  { perm_name: "upload_isolate_image" },
  { perm_name: "delete_isolate_image" },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await queryInterface.bulkInsert("permissions", permissionsData, {});
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("permissions", null, {});
  },
};
