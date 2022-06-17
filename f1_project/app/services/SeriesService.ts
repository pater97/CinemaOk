import SerieRepository from "App/repositories/SerieRepository"
import { Serie } from "App/Models/Serie"

class SerieService {
  public async popular(): Promise<Array<Serie>> {
    return SerieRepository.popular()
  }

  public async findById(id: number): Promise<Serie> {
    return SerieRepository.findById(id)
  }
}

export default new SerieService()
