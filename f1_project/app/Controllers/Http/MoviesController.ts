// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MovieService from 'App/services/MovieService'

export default class MoviesController {

    public async index({ view }: HttpContextContract) {
        const PMovies = await MovieService.popular()
        return await view.render('home',{PMovies})
      }
}