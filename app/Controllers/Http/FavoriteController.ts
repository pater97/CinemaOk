import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Favorite from 'App/Models/favorite'
import MovieService from 'App/services/MovieService'
import Database from '@ioc:Adonis/Lucid/Database'
import { Movie } from 'App/Models/Movie'
import Logger from '@ioc:Adonis/Core/Logger'

export default class FavoriteController {
  public async index({ view, auth }: HttpContextContract) {
    //variabili per immagine e nav
    const coverLink = 'https://image.tmdb.org/t/p/original/'
    const active = 'favorites'
    //estraggo l'id dell'utente dalla richiesta
    const user_id = auth.user?.id
    //creo un'array nel quale inserirò gli id della tabella favorites
    let movies_id: Array<number> = []
    //prendo dal db gli id dei film che appartengono all'utente che effettua la richiesta
    const extract_movies_id = await Database.query()
      .select('movie_id')
      .from('favorites')
      .where({ user_id: user_id })
    //ciclo gli id ed estraggo solo il valore
    await extract_movies_id.forEach((element) => {
      movies_id.push(element.movie_id)
    })

    let movies: Array<Movie> = []

    async function getMovie(movieIds: Array<number>, movies: Array<Movie>) {
      try {
        await Promise.all(
          movieIds.map(async (id) => {
            Logger.debug(`Movie id: ${id.toString()}`)
            movies.push(await MovieService.findById(id))
          })
        )
      } catch (e) {
        Logger.error('Si è verificato un errore!')
      }
    }
    //creo un array nel quale inserirò gli oggetti movie
    await getMovie(movies_id, movies)

    //ciclo gli id ed estraggo l'intero film per ogni id
    // Logger.info('Movie', { movies })
    // console.log(movies)

    return await view.render('favorites/index', { coverLink, active })
  }

  //salva il contenuto del form
  public async add({ request, auth }: HttpContextContract) {
    const movie_id = await request.input('movie_id')
    //  //definisco l'oggetto
    const favorites = {
      movie_id: movie_id,
      user_id: auth.user?.id,
    }
    await Favorite.create(favorites)
  }
}
