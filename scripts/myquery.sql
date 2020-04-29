USE peliculas;
UPDATE genero
SET nombre = "Action"
WHERE id=1;

USE peliculas;
SELECT * from pelicula LIMIT 10;


USE peliculas;
select * from genero;

USE peliculas;
describe pelicula;

ALTER TABLE pelicula ADD FOREIGN KEY (genero_id) REFERENCES genero(id);


USE peliculas;
DELETE FROM genero WHERE id=16
select nombre from genero

USE peliculas;
SELECT * FROM pelicula WHERE anio=2002;

 select * from pelicula where anio=2002 titulo=harry

USE peliculas;
 select * from pelicula 
 join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id 
 join actor on actor_pelicula.actor_id = actor.id
 join genero on pelicula.genero_id = genero.id
    where pelicula.id=2;

 USE peliculas;
 select * from pelicula where id=2

 select * , actor.nombre as anombre, genero.nombre as gnombre from pelicula join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id join actor on actor_pelicula.actor_id = actor.id join genero on pelicula.genero_id = genero.id where pelicula.id = 2;

 USE pelicula;
 SELECT * from pelicula JOIN genero on pelicula.genero_id = genero.id WHERE genero.nombre =Accion;