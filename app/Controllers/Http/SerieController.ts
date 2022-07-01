import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SeriesService from 'App/services/SeriesService'

export default class SerieController {
  public async index({ view }: HttpContextContract) {
    //path per visualizzare le immagini
    const coverLink = 'https://image.tmdb.org/t/p/original/'
    // const coverLink = 'http://image.tmdb.org/t/p/w342/'

    //classe active per la nav
    const active = 'series'
    //lista di serie in base al tipo
    const onAir = await SeriesService.onAir()
    const top = await SeriesService.top()
    const pop = await SeriesService.popular()
    const theBoys = await SeriesService.findById(76479)
    //creo funzione per ricevere un film randomico da mostrare in prima pagina
    //definisco l'array nel quale andranno ad inserirsi i film
    let id_array: Array<string> = []
    //creo la funzione per pushare l'id dei film nell'array
    await onAir.forEach((element) => {
      let id_serie = element.id.toString()
      id_array.push(id_serie)
    })
    //verifico che sia andata a buon fine        //creo la funzione randomica
    const random = Math.floor(Math.random() * 19)
    //estrapolo il film casuale
    const id_random = id_array[random]
    //ottengo il film
    const firstSerie = await SeriesService.findById(+id_random)
    // console.log(firstMovie)
    return await view.render('serie/index', {
      active,
      coverLink,
      onAir,
      top,
      pop,
      firstSerie,
      theBoys,
    })
  }

  public async show({ view, params }: HttpContextContract) {
    //classe active per la nav
    const active = 'series'
    //path per visualizzare le immagini
    const coverLink = 'https://image.tmdb.org/t/p/original/'
    //ricerco per id e rispondo con il film
    const Serie = await SeriesService.findById(params.id)
    //film simili
    const similar = await SeriesService.similar(params.id)
    //estrapolo il video trailer
    const trailerKeys = await SeriesService.getTrailer(params.id)
    // console.log(trailerKeys)
    const reviews = await SeriesService.getReviews(params.id)
    //renderizzo la pagina con il film in questione
    return await view.render('serie/show', {
      Serie,
      active,
      coverLink,
      trailerKeys,
      reviews,
      similar,
    })
  }
}
