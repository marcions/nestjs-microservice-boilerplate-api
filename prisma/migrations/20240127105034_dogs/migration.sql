/*
  Warnings:

  - You are about to drop the `Dogs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Dogs`;

-- CreateTable
CREATE TABLE `dogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `breed` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `status` BOOLEAN NOT NULL,
    `deleted` BOOLEAN NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NULL,
    `deletedBy` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
