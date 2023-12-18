-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-12-2023 a las 02:44:14
-- Versión del servidor: 8.0.23
-- Versión de PHP: 7.3.29
SET
    SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET
    time_zone = "+00:00";

--
-- Base de datos: `technical-knoledge`
--
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `country`
--
CREATE TABLE `country` (
    `id` int NOT NULL,
    `name` varchar(20) COLLATE utf8_bin NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_bin;

--
-- Volcado de datos para la tabla `country`
--
INSERT INTO
    `country` (`id`, `name`)
VALUES
    (1, 'España'),
    (2, 'Portugal');

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `home`
--
CREATE TABLE `home` (
    `id` int NOT NULL,
    `address` varchar(50) COLLATE utf8_bin NOT NULL,
    `alias` varchar(50) COLLATE utf8_bin DEFAULT NULL,
    `type` enum('piso', 'chalet', 'dúplex', 'estudio') COLLATE utf8_bin NOT NULL,
    `id_country` int NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_bin;

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `user`
--
CREATE TABLE `user` (
    `id` int NOT NULL,
    `name` varchar(20) COLLATE utf8_bin NOT NULL,
    `lastname` varchar(50) COLLATE utf8_bin NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_bin;

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `user_home`
--
CREATE TABLE `user_home` (
    `id_user` int NOT NULL,
    `id_home` int NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8 COLLATE = utf8_bin;

--
-- Índices para tablas volcadas
--
--
-- Indices de la tabla `country`
--
ALTER TABLE
    `country`
ADD
    PRIMARY KEY (`id`);

--
-- Indices de la tabla `home`
--
ALTER TABLE
    `home`
ADD
    PRIMARY KEY (`id`),
ADD
    KEY `id_country` (`id_country`);

--
-- Indices de la tabla `user`
--
ALTER TABLE
    `user`
ADD
    PRIMARY KEY (`id`);

--
-- Indices de la tabla `user_home`
--
ALTER TABLE
    `user_home`
ADD
    KEY `id_home` (`id_home`),
ADD
    KEY `id_user` (`id_user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--
--
-- AUTO_INCREMENT de la tabla `country`
--
ALTER TABLE
    `country`
MODIFY
    `id` int NOT NULL AUTO_INCREMENT,
    AUTO_INCREMENT = 3;

--
-- AUTO_INCREMENT de la tabla `home`
--
ALTER TABLE
    `home`
MODIFY
    `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE
    `user`
MODIFY
    `id` int NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--
--
-- Filtros para la tabla `home`
--
ALTER TABLE
    `home`
ADD
    CONSTRAINT `home_ibfk_1` FOREIGN KEY (`id_country`) REFERENCES `country` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `user_home`
--
ALTER TABLE
    `user_home`
ADD
    CONSTRAINT `user_home_ibfk_1` FOREIGN KEY (`id_home`) REFERENCES `home` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD
    CONSTRAINT `user_home_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;