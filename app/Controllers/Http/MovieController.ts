import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MovieService from 'App/services/MovieService'

export default class MoviesController {
  public async index({ view }: HttpContextContract) {
    //path per visualizzare le immagini
    const coverLink = 'https://image.tmdb.org/t/p/original/'
    //classe active per la nav
    const active = 'movies'
    //lista di film in base al tipo
    const topMovies = await MovieService.top()
    const upMovies = await MovieService.upcoming()
    const popMovies = await MovieService.popular()
    //creo funzione per ricevere un film randomico da mostrare in prima pagina
    //definisco l'array nel quale andranno ad inserirsi i film
    let id_array: Array<string> = []
    //creo la funzione per pushare l'id dei film nell'array
    await popMovies.forEach((element) => {
      let id_movie = element.id.toString()
      id_array.push(id_movie)
    })
    //verifico che sia andata a buon fine
    // console.log(id_array)
    //creo la funzione randomica
    const random = Math.floor(Math.random() * 19)
    //estrapolo il film casuale
    const id_random = id_array[random]
    //ottengo il film
    const firstMovie = await MovieService.findById(+id_random)
    // console.log(firstMovie)
    return await view.render('movie/index', {
      active,
      coverLink,
      topMovies,
      upMovies,
      popMovies,
      firstMovie,
    })
  }

  public async show({ view, params }: HttpContextContract) {
    //classe active per la nav
    const active = 'movies'
    //path per visualizzare le immagini
    const coverLink = 'https://image.tmdb.org/t/p/original/'
    //ricerco per id e rispondo con il film
    const Movie = await MovieService.findById(params.id)
    //film simili
    const similar = await MovieService.similar(params.id)
    //estrapolo il video trailer
    const trailerKeys = await MovieService.getTrailer(params.id)
    // console.log(trailerKeys)
    const reviews = await MovieService.getReviews(params.id)
    //renderizzo la pagina con il film in questione
    return await view.render('movie/show', {
      Movie,
      active,
      coverLink,
      trailerKeys,
      reviews,
      similar,
    })
  }
}
