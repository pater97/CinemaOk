import MovieRepository from 'App/Repositories/MovieRepository'
import { Movie } from 'App/Models/Movie'

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
    console.log(MovieRepository.onTheatres())
    return MovieRepository.onTheatres()
  }
  //cerco per id
  public async findById(id: number): Promise<Movie> {
    return MovieRepository.findById(id)
  }
}

export default new MovieService()
