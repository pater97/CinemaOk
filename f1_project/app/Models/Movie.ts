interface MovieInterface {
    title: string
    overview: number
    backdrop: number
  }
  
  export class Movie {
    public title: string
    public overview: number
    public backdrop: number
  
    constructor(movie: MovieInterface) {
      this.title = movie.title
      this.overview = movie.overview
      this.backdrop = movie.backdrop
    }
  
    public getPublicInfo() {
      return `Ciao sono ${this.title} e questo è la mia copertina: ${this.backdrop}`
    }
  }