"use strict";
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  return passwordHash;
};

const usersData = [
  {
    first_name: "Test",
    last_name: "Admin",
    username: "testadmin",
    email: "testadmin@admin.com",
    role_name: "Admin",
    role_id: 1,
    password: "DPq65k&5+U(W",
  },
  {
    first_name: "Test",
    last_name: "Researcher",
    username: "testresearcher",
    email: "testresearcher@researcher.com",
    role_name: "Researcher",
    role_id: 1,
    password: "password",
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedUsers = await Promise.all(
      usersData.map(async (user) => {
        const hashedPassword = await hashPassword(user.password);
        delete user.password;
        return {
          ...user,
          password: hashedPassword,
        };
      })
    );

    await queryInterface.bulkInsert("users", hashedUsers, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
