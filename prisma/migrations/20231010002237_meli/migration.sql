-- CreateTable
CREATE TABLE `Dogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `breed` VARCHAR(255),
    `age` INTEGER,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `deleted` BOOLEAN,
    `userId` VARCHAR(255) NOT NULL,
    `createdBy` VARCHAR(255) NOT NULL,
    `updatedBy` VARCHAR(255),
    `deletedBy` VARCHAR(255),
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime,
    `deletedAt` datetime,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

