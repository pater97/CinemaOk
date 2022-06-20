import MovieRepository from 'App/Repositories/MovieRepository'
import { Movie } from 'App/Models/Movie'
import { Video } from 'App/Models/Video'
import { Reviews } from 'App/Models/Reviews'

class MovieService {
  //ritorno i film popolari
  public async popular(): Promise<Array<Movie>> {
    return MovieRepository.popular()
  }
  //ritorno i meglio votati
  public async top(): Promise<Array<Movie>> {
    return MovieRepository.top()
  }
  //ritorno i prossimi in uscita
  public async upcoming(): Promise<Array<Movie>> {
    return MovieRepository.upcoming()
  }
  //ritorno i film in sala
  public async onTheatres(): Promise<Array<Movie>> {
    return MovieRepository.onTheatres()
  }
  //cerco per id
  public async findById(id: number): Promise<Movie> {
    return MovieRepository.findById(id)
  }
  public async similar(id:number) : Promise<Array<Movie>> {
    return MovieRepository.similar(id)
  }
  //gestione del trialer
  public async getTrailer(id:number) : Promise<Array<Video>>{
    return MovieRepository.VideoTrailer(id)
  }
  //gestione delle recensioni
  public async getReviews(id:number) : Promise<Array<Reviews>>{
    return MovieRepository.getReviews(id)
  }
}

export default new MovieService()
