'use strict';
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      username: 'akuntest',
      password:  bcrypt.hashSync("Test Password"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },{
      username: 'akuntest1',
      password: bcrypt.hashSync("Test Password1"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }])
    await queryInterface.bulkInsert('transactions', [{
      amount: 5000,
      notes: "transaksi 1",
      date: new Date().toISOString(),
      type: "income",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 1,
    },{
      amount: 10000,
      notes: "transaksi",
      date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      type: "expense",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: 2,
    }])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('transactions', null, {})
    await queryInterface.bulkDelete('users', null, {})
  }
};
