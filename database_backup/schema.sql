DROP TABLE IF EXISTS `phone_numbers`;

CREATE TABLE `phone_numbers`
(
    `id`           int(9) NOT NULL AUTO_INCREMENT,
    `phonebook_id` int(9) unsigned NOT NULL,
    `phone_number` int(9) unsigned NOT NULL,
    `type`         varchar(100) NOT NULL,
    `created_date` timestamp    NOT NULL DEFAULT current_timestamp(),
    `updated_date` timestamp    NOT NULL DEFAULT current_timestamp(),
    UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `phonebook`;

CREATE TABLE `phonebook`
(
    `id`           int(9) NOT NULL AUTO_INCREMENT,
    `full_name`    varchar(100) NOT NULL,
    `created_date` timestamp    NOT NULL DEFAULT current_timestamp(),
    `updated_date` timestamp    NOT NULL DEFAULT current_timestamp(),
    UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;