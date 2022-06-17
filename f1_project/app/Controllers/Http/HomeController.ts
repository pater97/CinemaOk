// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MovieService from 'App/services/MovieService'
import SeriesService from 'App/services/SeriesService'

export default class MoviesController {

    public async index({ view }: HttpContextContract) {
        const coverLink = 'http://image.tmdb.org/t/p/w342/'
        const PMovies = await MovieService.popular()
        const PSeries = await SeriesService.popular()
        const active = 'home'
        return await view.render('home',{PMovies,PSeries,coverLink,active})
      }
}