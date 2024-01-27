/*
  Warnings:

  - You are about to alter the column `name` on the `Dogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `breed` on the `Dogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `userId` on the `Dogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `createdBy` on the `Dogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `updatedBy` on the `Dogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `deletedBy` on the `Dogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Dogs` MODIFY `name` VARCHAR(191) NOT NULL,
    MODIFY `breed` VARCHAR(191) NULL,
    ALTER COLUMN `status` DROP DEFAULT,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    MODIFY `createdBy` VARCHAR(191) NOT NULL,
    MODIFY `updatedBy` VARCHAR(191) NULL,
    MODIFY `deletedBy` VARCHAR(191) NULL,
    MODIFY `createdAt` DATETIME(3) NOT NULL,
    MODIFY `updatedAt` DATETIME(3) NULL,
    MODIFY `deletedAt` DATETIME(3) NULL;
