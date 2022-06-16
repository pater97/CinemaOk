import MovieRepository from 'App/Repositories/MovieRepository'
import { Movie } from 'App/Models/Movie'

class MovieService {
  public async popular(): Promise<Array<Movie>> {
    return MovieRepository.popular()
  }

  public async findById(id: number): Promise<Movie> {
    return MovieRepository.findById(id)
  }
}

export default new MovieService()
