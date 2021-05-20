-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 19-04-2021 a las 11:36:21
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `puzzle`
--
CREATE DATABASE IF NOT EXISTS `puzzle` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `puzzle`;

-- --------------------------------------------------------

GRANT ALL PRIVILEGES ON puzzle.* TO 'pcw'@127.0.0.1 IDENTIFIED BY 'pcw';

-- --------------------------------------------------------

--
-- Borrado, en orden, de todas las tablas
--

DROP TABLE IF EXISTS `puntuacion`;
DROP TABLE IF EXISTS `imagen`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagen`
--

DROP TABLE IF EXISTS `imagen`;
CREATE TABLE `imagen` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `fichero` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `imagen`
--

INSERT INTO `imagen` (`id`, `nombre`, `fichero`) VALUES
(1, 'Imagen 1', 'img1.jpg'),
(2, 'Imagen 2', 'img2.jpg'),
(3, 'Imagen 3', 'img3.jpg'),
(4, 'Imagen 4', 'img4.jpg'),
(5, 'Imagen 5', 'img5.jpg'),
(6, 'Imagen 6', 'img6.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntuacion`
--

DROP TABLE IF EXISTS `puntuacion`;
CREATE TABLE `puntuacion` (
  `id` int(11) NOT NULL,
  `id_imagen` int(11) NOT NULL,
  `usuario` varchar(100) NOT NULL,
  `dificultad` varchar(6) NOT NULL,
  `jugadas` smallint(6) NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `puntuacion`
--

INSERT INTO `puntuacion` (`id`, `id_imagen`, `usuario`, `dificultad`, `jugadas`, `fecha_hora`) VALUES
(1, 4, 'Pedro', '4x4', 32, '2021-03-14 09:21:14'),
(2, 2, 'Ana', '4x4', 18, '2021-02-27 16:13:28'),
(3, 3, 'Luis', '6x6', 36, '2021-03-04 11:56:15'),
(4, 1, 'María', '4x4', 28, '2021-03-21 22:24:22'),
(5, 4, 'Lucía', '6x6', 32, '2021-04-05 15:13:07'),
(6, 5, 'Antonio', '4x4', 15, '2021-04-05 15:15:09'),
(7, 2, 'Pepe', '6x6', 32, '2021-04-06 15:18:17');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `imagen`
--
ALTER TABLE `imagen`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_imagen` (`id_imagen`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `imagen`
--
ALTER TABLE `imagen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `puntuacion`
--
ALTER TABLE `puntuacion`
  ADD CONSTRAINT `puntuacion_ibfk_1` FOREIGN KEY (`id_imagen`) REFERENCES `imagen` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
