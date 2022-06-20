// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MovieService from 'App/services/MovieService'
import SeriesService from 'App/services/SeriesService'

export default class MoviesController {

    public async index({ view }: HttpContextContract) {
        const coverLink = 'http://image.tmdb.org/t/p/w342/'
        const Movies = await MovieService.onTheatres()
        const Series = await SeriesService.onAir()
        const active = 'home'
         //definisco l'array nel quale andranno ad inserirsi i film
         let id_array:Array<string> = []
         //creo la funzione per pushare l'id dei film nell'array
         await Movies.forEach(element => {
             let id_movie = element.id.toString()
             id_array.push(id_movie)
         }) 
         //verifico che sia andata a buon fine
         // console.log(id_array)
         //creo la funzione randomica
         const random = Math.floor(Math.random() * 19);  
         //estrapolo il film casuale
         const id_random = id_array[random]
         //ottengo il film
         const firstMovie = await MovieService.findById(+id_random)
        return await view.render('home',{Movies,Series,coverLink,active,firstMovie})
      }
}