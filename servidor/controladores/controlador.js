var con = require('../lib/conexionbd');

function mostrarPeliculas(req, res) {

    let myQuery;
    const { anio, titulo, genero, columna_orden, tipo_orden, pagina, cantidad } = req.query
    //Creo el filtro --> empieza con where si hay algun filtro
    let filtro;
    let orden;
    let paginacion;
    let cantFiltros = 0;
    //si hay alguno de los filtros se suma y se agrega and si corresponde
    if (anio || titulo || genero) {
        filtro = ` where `
        if (anio) {
            cantFiltros++
            if (cantFiltros > 1) {
                filtro = filtro + ' and ' + `anio=${anio}`
            } else {
                filtro = filtro + `anio=${anio}`
            }
        }
        if (titulo) {
            cantFiltros++
            if (cantFiltros > 1) {
                filtro = filtro + ' and ' + `titulo like "%${titulo}%"`
            } else {
                filtro = filtro + `titulo like "%${titulo}%"`
            }
        }
        if (genero) {
            cantFiltros++
            if (cantFiltros > 1) {
                filtro = filtro + ' and ' + `genero_id=${genero}`
            } else {
                filtro = filtro + `genero_id=${genero}`
            }
        }

    }

    if (columna_orden) {
        orden = ' order by ';
        if (columna_orden === "titulo") {
            orden = orden + "titulo " + tipo_orden
        }
        if (columna_orden === "anio") {
            orden = orden + "anio " + tipo_orden
        }
        if (columna_orden === "puntuacion") {
            orden = orden + "puntuacion " + tipo_orden
        }
    }

    if (pagina && cantidad) {
        let offset;
        offset = (pagina - 1) * cantidad;
        paginacion = `limit ${offset},${cantidad}`
    }

    if (filtro && orden) {
        myQuery = `select * from pelicula ${filtro} ${orden}`
    } else if (filtro) {
        myQuery = `select * from pelicula ${filtro}`
    } else if (orden) {
        myQuery = `select * from pelicula ${orden}`
    } else {
        myQuery = `select * from pelicula`
    }

    const totalPeliculas = `select count(id) from pelicula;`
    //myQuery = myQuery + paginacion + `;`;
    myQuery = `${myQuery} ${paginacion} ;`

    //console.log(`myQuery = ${myQuery}`)
    con.query(myQuery, function (error, resultado) {
        var totalPelis;
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        con.query(totalPeliculas, function (error, resultTotal) {
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(404).send("Hubo un error en la consulta");
            }
            totalPelis = resultTotal[0]['count(id)'];

            //si no hubo error, se crea el objeto respuesta con las peliculas encontradas
            var respuesta = {
                'peliculas': resultado,
                'total': totalPelis
            };
            //console.log(respuesta.total)
            //se envía la respuesta
            res.send(JSON.stringify(respuesta));
        })

    })
}


function obtenerGeneros(req, res) {
    var sql = "select id, nombre from genero"

    con.query(sql, function (error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta en obtenerGeneros");
        }
        //si no hubo error, se crea el objeto respuesta con los generos
        var respuesta = {
            'generos': resultado
        };
        //se envía la respuesta
        res.send(JSON.stringify(respuesta));
    })
}

function obtenerInformacionDePelicula(req, res) {
    //se obtiene el path param id
    var id = req.params.id;
    //se crea la consulta que obtiene

    var sql = " select * , actor.nombre as anombre, genero.nombre as gnombre from pelicula join actor_pelicula on pelicula.id = actor_pelicula.pelicula_id join actor on actor_pelicula.actor_id = actor.id join genero on pelicula.genero_id = genero.id where pelicula.id = " + id;
    // var pelicula = " select * from pelicula where pelicula.id = " + id;
    // var actores = " select * from actor_pelicula join actor on actor_pelicula.actor_id = actor.id where pelicula_id = " + id;
    // var genero = " select * from pelicula join genero on pelicula.genero_id = genero.id";

    con.query(sql, function (error, resultado) {

        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta en obtenerInformacionDePelicula");
        }
        var totalActores = [];

        resultado.forEach(el => {
            var actores = {
                nombre: el.anombre
            }
            totalActores.push(actores);
        });

        //console.log(totalActores)

        //si no hubo error, se crea el objeto respuesta con los generos
        var respuesta = {
            'pelicula': resultado[0],
            'actores': totalActores,
            'genero': resultado[0].gnombre,
        };
        //console.log(respuesta.pelicula)
        // console.log(respuesta.actores)
        // console.log(respuesta.genero)


        //se envía la respuesta
        res.send(JSON.stringify(respuesta));
    })
}

function obtenerPeliculasRecomendadas(req, res) {
    //const genero = req.query.genero;
    let myQuery;
    let filtro;
    let cantFiltros=0

    const { genero, anio_inicio, anio_fin, puntuacion } = req.query;
    if (genero || anio_inicio || anio_fin || puntuacion) {
        filtro = ` where `
        if (genero) {
            cantFiltros++
            filtro = filtro + `genero.nombre="${genero}"`
        }
        
        if (anio_inicio) {
            cantFiltros++
            if (cantFiltros > 1) {
                filtro = filtro + ' and ' + `pelicula.anio>=${anio_inicio}`
            } else {
                filtro = filtro + `pelicula.anio>=${anio_inicio}`
            }
        }
        if (anio_fin) {
            cantFiltros++
            if (cantFiltros > 1) {
                filtro = filtro + ' and ' + `pelicula.anio<=${anio_fin}`
            } else {
                filtro = filtro + `pelicula.anio<=${anio_fin}`
            }
        }
        if (puntuacion) {
            cantFiltros++
            if (cantFiltros > 1) {
                //where genero.nombre=Comedypelicula.anio=2005
                filtro = filtro + ' and ' + `pelicula.puntuacion=${puntuacion}`
            } else {
                filtro = filtro + `pelicula.puntuacion=${puntuacion}`
            }
        }
        myQuery = `SELECT *, pelicula.id as pid from pelicula JOIN genero on pelicula.genero_id = genero.id ${filtro}`
        console.log(myQuery)
    }
   
    con.query(myQuery, function (error, resultado) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta en obtenerPeliculasRecomendadas");
        }
        //si no hubo error, se crea el objeto respuesta con los generos
        var respuesta = {
            'peliculas': resultado
        };
        //se envía la respuesta
        console.log(respuesta)
        res.send(JSON.stringify(respuesta));
    })

}

module.exports = {
    mostrarPeliculas: mostrarPeliculas,
    obtenerGeneros: obtenerGeneros,
    obtenerInformacionDePelicula: obtenerInformacionDePelicula,
    obtenerPeliculasRecomendadas: obtenerPeliculasRecomendadas,
}