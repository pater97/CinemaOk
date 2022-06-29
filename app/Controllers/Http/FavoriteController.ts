import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Favorite from 'App/Models/favorite'
import MovieService from 'App/services/MovieService'
import Database from '@ioc:Adonis/Lucid/Database'
import { Movie } from 'App/Models/Movie'
import Logger from '@ioc:Adonis/Core/Logger'
import { Serie } from 'App/Models/Serie'
import SeriesService from 'App/services/SeriesService'

export default class FavoriteController {
  public async index({ view, auth, params, response }: HttpContextContract) {
    //variabili per immagine e nav
    const coverLink = 'https://image.tmdb.org/t/p/original/'
    const active = 'favorites'
    //estraggo l'id dell'utente dalla richiesta
    const user_id = params.userId
    //verifico se l'utente che fa la richiesta è lo stesso proprietario dei favorites
    if (params.userId.toString() !== auth.user?.id.toString() && auth.user?.is_admin === false) {
      return response.redirect('/')
    }

    //MOVIE/////
    //creo un'array nel quale inserirò gli id della tabella favorites
    let movies_id: Array<number> = []
    let series_id: Array<number> = []
    //prendo dal db gli id dei film che appartengono all'utente che effettua la richiesta
    const extract_all = await Database.query()
      .select('movie_id', 'serie_id')
      .from('favorites')
      .where({ user_id: user_id })
    //ciclo gli id ed estraggo solo il valore sia per le serie tv che per i film dov non è nullo
    await extract_all.forEach((element) => {
      if (element.movie_id !== null) {
        movies_id.push(element.movie_id)
      }
      if (element.serie_id !== null) {
        series_id.push(element.serie_id)
      }
    })
    //creo gli array dove inserirò i miei film o serie tv con tutte le info
    let movies: Array<Movie> = []
    let series: Array<Serie> = []
    //funzione che estrapola tutti i movie presenti nell'array
    async function getContent(arrayIds: Array<number>, arrayDest: Array<object>, services) {
      try {
        await Promise.all(
          arrayIds.map(async (id) => {
            arrayDest.push(await services.findById(id))
          })
        )
      } catch (e) {
        Logger.error('Si è verificato un errore!')
      }
    }
    // eseguo la funzione sia per le serie che per i film
    //movie
    await getContent(movies_id, movies, MovieService)
    //serie
    await getContent(series_id, series, SeriesService)

    return await view.render('favorites/index', { coverLink, active, movies, series, user_id })
  }

  //salva il contenuto del form
  public async add({ request, auth, response }: HttpContextContract) {
    //estraggo gli id del film o serie dalla richiesta
    const movie_id = await request.input('movie_id')
    const serie_id = await request.input('serie_id')
    //gestisco la condizione per vedere se sto aggiungendo una serie o un film e se sono già presenti
    if (serie_id === undefined) {
      if (await Favorite.findBy('movie_id', movie_id, 'user_id', auth.user?.id)) {
        return response.redirect(`/favorites/${auth.user?.id}`)
      }
      const favorites = {
        movie_id: movie_id,
        user_id: auth.user?.id,
      }
      //creo il nuovo record
      await Favorite.create(favorites)
    } else {
      if (await Favorite.findBy('serie_id', serie_id, 'user_id', auth.user?.id)) {
        return response.redirect(`/favorites/${auth.user?.id}`)
      }
      const favorites = {
        serie_id: serie_id,
        user_id: auth.user?.id,
      }
      //creo nuovo record
      await Favorite.create(favorites)
    }
    //creo il nuovo record
    return response.redirect(`/favorites/${auth.user?.id}`)
  }

  public async delete({ request, response }: HttpContextContract) {
    //estrapolo gli id utente che ha creato e film selezionato
    const movieId = request.input('movieId')
    const serieId = request.input('serieId')
    const creatorId = request.input('creatorId')
    //cerco il film o serie creato dall'utente
    if (serieId === undefined) {
      const id_to_delete = await Database.query()
        .select('id')
        .from('favorites')
        .where({ movie_id: movieId, user_id: creatorId })
      const id = await id_to_delete[0].id
      // return response.redirect('/')
      const favorite = await Favorite.findOrFail(id)
      favorite.delete()
    } else {
      const id_to_delete = await Database.query()
        .select('id')
        .from('favorites')
        .where({ serie_id: serieId, user_id: creatorId })
      const id = await id_to_delete[0].id
      // return response.redirect('/')
      const favorite = await Favorite.findOrFail(id)
      favorite.delete()
    }
    return response.redirect(`/favorites/${creatorId}`)
  }
}
