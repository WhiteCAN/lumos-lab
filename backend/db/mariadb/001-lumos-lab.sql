-- 기존 Lumos 스키마는 변경하지 않는다. 적용 전 대상 서버를 확인한다.
CREATE DATABASE IF NOT EXISTS `LUMOS_LAB`
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `LUMOS_LAB`.`transaction_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `scenario` VARCHAR(255),
    `message` VARCHAR(255),
    `created_at` DATETIME(6),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `LUMOS_LAB`.`bulk_insert_lab` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `payload` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
