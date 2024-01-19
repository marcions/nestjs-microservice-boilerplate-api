'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`CREATE TABLE IF NOT EXISTS cats (
      id uuid NOT NULL,
      "name" text NOT NULL,
      breed text NOT NULL,
      age int4 NOT NULL,
      status boolean NOT NULL DEFAULT true,
      deleted boolean NULL,
      userId uuid NOT NULL,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "createdBy" uuid NOT NULL,
      "updatedAt" timestamp NULL,
      "updatedBy" uuid NULL,
      "deletedAt" timestamp NULL,
      "deletedBy" uuid NULL,
      CONSTRAINT "PK_CATS_KEY" PRIMARY KEY (id)
  );`);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`DROP TABLE IF EXISTS cats`)
  }
};
