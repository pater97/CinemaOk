interface SerieInterface {
    name: string
    overview: string
    backdrop: string
    date: Date
    rank: Number
    id: Number

  }
  
  export class Serie {
    public name: string
    public overview: string
    public backdrop: string
    public date: Date
    public rank: Number
    public id: Number
  
    constructor(serie: SerieInterface) {
      this.name = serie.name
      this.overview = serie.overview
      this.backdrop = serie.backdrop
      this.date = serie.date
      this.rank = serie.rank
      this.id = serie.id
    }
  
  }