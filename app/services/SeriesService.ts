import SerieRepository from 'App/repositories/SerieRepository'
import { Serie } from 'App/Models/Serie'
import { Video } from 'App/Models/Video'
import { Reviews } from 'App/Models/Reviews'

class SerieService {
  public async popular(): Promise<Array<Serie>> {
    return SerieRepository.popular()
  }

  public async findById(id: number): Promise<Serie> {
    return SerieRepository.findById(id)
  }
  public async top(): Promise<Array<Serie>> {
    return SerieRepository.top()
  }
  public async onAir(): Promise<Array<Serie>> {
    return SerieRepository.onAir()
  }
  public async similar(id: number): Promise<Array<Serie>> {
    return SerieRepository.similar(id)
  }
  //gestione del trialer
  public async getTrailer(id: number): Promise<Array<Video>> {
    return SerieRepository.VideoTrailer(id)
  }
  //gestione delle recensioni
  public async getReviews(id: number): Promise<Array<Reviews>> {
    return SerieRepository.getReviews(id)
  }
}

export default new SerieService()
