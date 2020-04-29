CREATE DATABASE peliculas;

USE peliculas;

CREATE TABLE `pelicula` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(100),
    `duracion` INT(5),
    `director` VARCHAR(400),
    `anio` INT(5),
    `fecha_lanzamiento` DATE,
    `puntuacion` INT(2),
    `poster` VARCHAR(300),
    `trama` VARCHAR(700),
    PRIMARY KEY (`id`)
);

CREATE TABLE `genero` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30),
  PRIMARY KEY (`id`),
); 

ALTER TABLE pelicula ADD COLUMN genero_id int(11) NOT NULL;
ALTER TABLE pelicula ADD FOREIGN KEY (genero_id) REFERENCES genero(id);


CREATE TABLE `actor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(70),
  PRIMARY KEY (`id`)
); 

CREATE TABLE `actor_pelicula` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `actor_id` int(11) NOT NULL,
  `pelicula_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`actor_id`) REFERENCES `actor` (`id`),
  FOREIGN KEY (`pelicula_id`) REFERENCES `pelicula` (`id`)
);
