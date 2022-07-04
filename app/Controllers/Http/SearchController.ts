import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MoviesController {
  public async index({ view }: HttpContextContract) {
    const coverLink = 'https://image.tmdb.org/t/p/original/'
    const active = 'search'
    return await view.render('search', { coverLink, active })
  }
}
