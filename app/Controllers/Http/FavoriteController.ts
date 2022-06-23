import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Favorite from 'App/Models/favorite'
import MovieService from 'App/services/MovieService'
import Database from '@ioc:Adonis/Lucid/Database'

export default class FavoriteController {
  public async index({ view, auth }: HttpContextContract) {
    const coverLink = 'https://image.tmdb.org/t/p/original/'
    const active = 'favorites'
    const user_id = auth.user?.id
    let movies_id: Array<number> = []
    let movies = []
    const extract_movies_id = await Database.query()
      .select('movie_id')
      .from('favorites')
      .where({ user_id: user_id })
    await extract_movies_id.forEach((element) => {
      movies_id.push(element.movie_id)
    })

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
