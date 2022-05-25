-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-05-2022 a las 20:14:23
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 7.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tfg`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calendars`
--

CREATE TABLE `calendars` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `calendars`
--

INSERT INTO `calendars` (`id`, `name`, `user`, `hash`) VALUES
(88, 'test', 'iamjosito', '6112970129a2b52'),
(90, 'test 2', 'iamjosito', 'b2081a3a79195b3'),
(91, 'test 2', 'paquillo', 'b2081a3a79195b3'),
(92, 'test 3', 'iamjosito', '069b2349bb67b90a'),
(93, 'test 3', 'paquillo', '069b2349bb67b90a'),
(94, 'test 4', 'iamjosito', 'b1a136476b1a854'),
(95, 'test 4', 'paquillo', 'b1a136476b1a854'),
(96, 'Amigos', 'test', '40a3b614877183a6'),
(98, 'Amigos', 'iamjosito', '9976274b84b71a4'),
(99, 'Amigos', 'test', '9976274b84b71a4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `calendar` int(11) NOT NULL,
  `user` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `date`, `calendar`, `user`) VALUES
(74, 'Futbol con amigos', 'Futbol con los amigos de toda la vida, desde las 20:00 a', '25-05-2022', 88, 'iamjosito'),
(75, 'asd', 'asd', '01-06-2022', 88, 'iamjosito');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`name`, `surname`, `username`, `mail`, `password`) VALUES
('Jose', 'Rodriguez', 'iamjosito', 'joserr0209@gmail.com', 'U2FsdGVkX1+kqMlpfr8e0GdBgXxqLKTO+jpOXYicLGE='),
('Paco', 'Jimenez', 'paquillo', 'pacojimenez@gmail.com', 'U2FsdGVkX19RLIDm9T2yXNN05NcVCjo7HGY9szIJQG8='),
('test', 'test', 'test', 'test', 'U2FsdGVkX1+1x3Du6Avym3IB5mPH/n9KuYnvm1xF0Y0=');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `calendars`
--
ALTER TABLE `calendars`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `calendar` (`calendar`),
  ADD KEY `user` (`user`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`) USING BTREE,
  ADD UNIQUE KEY `mail` (`mail`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `calendars`
--
ALTER TABLE `calendars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT de la tabla `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`calendar`) REFERENCES `calendars` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
