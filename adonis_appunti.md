# inizializzazione

- lanciare il comando 
    -> **npm init adonis-ts-app@latest hello-world**

- selezionare che tipo di app che i vuole eseguire tra tradizionale web/api oppure small ovvero con molti meno pacchetti in preset
- terminata l'installazione entrare con il terminale dentro al progetto -> cd nomeProgetto

- eseguire il comando per avviare il server 
    ->  **node ace serve --watch**

# gestione dei file

- eseguire per l'inizializzazione del webpack js e i file css
    -> **node ace configure encore**
- quest'ultima creerà la cartella resources/js e in teoria anche css
- per abilitare scss installare sass 
    -> **npm i -D sass-loader sass**
- e nel file webpack.js abilitare
    -> Encore.enableSassLoader()
- !!!ATTENZIONE!!! se non dovesse funzionare:
    + in resources/js/app.js
    ->
    import $ from 'jquery'
    import * as bootstrap from 'bootstrap'window.$ = $
    window.bootstrap = bootstrap
    import '../css/app.scss'
    + in app.css
    ->
    @import 'variables';
    @import '../../node_modules/bootstrap/scss/bootstrap'
    + infine eseguire **npm i -D bootstrap jquery**


- più info qui:    https://docs.adonisjs.com/guides/assets-manager#compiling-frontend-assets

# database 

- per connettersi al db installare il pacchetto 
    -> **npm i @adonisjs/lucid**
- lanciare il comando 
    -> **node ace configure @adonisjs/lucid**
    = scegliere il tipo di db con il quale si opera, questo permetterà di 
    + creare il file config/database.ts
    + modificare il .env/.env.example
    + aggiornare le configurazioni 

- nel file env.ts incollare dentro all'oggetto di env.roules
    ->
    DB_CONNECTION: Env.schema.string(),
    MYSQL_HOST: Env.schema.string({ format: 'host' }),
    MYSQL_PORT: Env.schema.number(),
    MYSQL_USER: Env.schema.string(),
    MYSQL_PASSWORD: Env.schema.string.optional(),
    MYSQL_DB_NAME: Env.schema.string()

- infine nel file .env impostare le variabili di ambiente
    ->
    DB_CONNECTION=mysql
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_USER=root
    MYSQL_PASSWORD=root
    MYSQL_DB_NAME=formula1

# migrazioni 

- le migrazioni servono per interagire con le tabelle creandole,modificandole o resettandole
- per creare una migration lanciare il comando
    -> **node ace make:migration nomeTabella**
- si creerà una cartella all'interno di database: database/migration che avrà un file per la creazione della tabella users
- ora bisognerà creare lo schema(la tabella) che si vuole partendo dalla preimpostazione fornita da adonis di id e data di creazione indicando nome delle colonne e tipo di dato che si inserira.
N.B: qui tutti i tipi di dato -> https://docs.adonisjs.com/reference/database/table-builder
- una volta creata la migrazione si può inviare al db eseguendo
    ->**node ace migration:run**
- ci sono varie operazioni che si possono fare su/con le migration , più dettagli qui
     -> https://docs.adonisjs.com/guides/database/migrations#document

# modelli

- si usano per
    + impostare le relazioni 
    + interrogare,modificare,aggiungere,eliminare i dati dalla tabella rappresentata

- creare un modello eseguendo 
    -> node ace make:model NomeTabAlSingolare 
    -> **node ace make:model User**

- si creerà un modello prefatto al quale bisognerà aggiungere tutti i campi della tabella in questo modo
    -> 
    @column()
    public email: string

- un'altro appunto importante è che la password non deve mai raggiungere il lato client e lo si imposta proprio nel modello in questo modo
    ->
    @column({serializeAs:null})
    public password: string

- sempre per la protezione della password(se non è stato fatto in fase di autentidicazione o comunque prima di raggiungere il modello) bisogna assicurarsi di non archiviare password in testo normale nel db, bensì è necessario criptarle 
    + per farlo si può usare un hook chiamato 'beforeSave' che eseguirà un operazione prima di salvare
    + importare quindi anche beforeSave insieme a baseModel e column 
    + alla fine delle varie colonne eseguire quindi il beforeSave()
    -> 
    @beforeSave()
    public static async hashPassword(user: User) {
        if (user.$dirty.password) {
        user.password = await Hash.make(user.password)
        }
    }
    n.b: per farlo importare anche hash per l'hashing della password -> **import Hash from '@ioc:Adonis/Core/Hash'**

- esistono anche delle proietà calcolate, sono dei dati che non vengono salvati nel db, ma rimangono disponibili tramite il nostro modello come se lo fossero.
    + un esempio concreto potrebbe essere voler avere nome + cognome sempre disponibile senza concatenarlo ogni volta, alla fine di tutti i procedimenti infatti potrei eseguire questa funzione che una volta richiamata mi darebbe il nome e il cognome completo
    -> 
    @computed()
    public get fullName() {
        return `${this.firstName} ${this.lastName}`
    }
    n.b: importare 'computed' in questo caso nello stesso modo di 'beforeSave'

- infine si possono specificare le relazioni tra tabelle 
    + importando in base a cosa serve e nello stesso modo di 'beforeSave' -> 'belongsTo','manyTomany' ecc.
    + importando il modello della tabella che si vuole relazionare 
    ->
     @belongsTo(() => Company)
    public company: BelongsTo<typeof Company>

* per fare prima si può creare con un solo comando migration/controller e models eseguendo
    -> **node ace make:model Task -mc**     //eseguendo solamente -m o -c si creerà solo migration o solo controller




# controller 

- hanno funzione di smistamento
- per creare un controller eseguire
    -> **node ace make:controller UserController**

# servicies

- i servicies sono responsabili della logica che solitamente è presente su un controller per centralizzarne l'esecuzione
# repository
- i repository invece sono responsabili della connessione con db o api

# template engine edge

- per rendere disponibile i dati su edge basta che al controller come secondo parametro si passi il dato tra parentesi graffe { movies }
- per inniettare dati nella pagina invece dopie graffe {{movie.title}}
- per quanto riguarda le logiche invece si usa la @
    ->@if (movies.legth)
    //contenuto
    @endif

# api su adonis

- dal sito dell'api recupero la chiave privata e la inserisco nel file .env
    -> THEMOVIEDB_API_TOKEN=f4f382566368553eb6b723d584f2ef4

- informo typesctipt nel file env.ts inserendolo nelle env.roules
    -> THEMOVIEDB_API_TOKEN:Env.schema.string()



- creo il file helpers/ApiHelper

import axios from 'axios'

import Logger from '@ioc:Adonis/Core/Logger'
import { Exception } from '@adonisjs/core/build/standalone'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH'

interface BasicCredentials {
  username: string
  password: string
}

interface ApiHelperConfig {
  url: string
  method?: Method
  baseURL?: string
  headers?: any
  params?: any
  paramsSerializer?: (params: any) => string
  data?: any
  timeout?: number
  auth?: BasicCredentials
}

export default async (config: ApiHelperConfig) => {
  try {
    Logger.info(`Calling '${config.url}'...`)
    const { data } = await axios(config)
    Logger.info(`Finish calling '${config.url}'`)

    return data
  } catch (e) {
    throw new Exception(`Error calling '${config.url}'`)
  }
}

- creo un modello di ciò che voglio estrapolare, basandomi su ciò che contiene la richiesta analizzandola con postman

interface MovieInterface {
  title: string
  overview: string
  backdrop: string
  date: Date
  rank: Number
  id: Number
}

export class Movie {
  public title: string
  public overview: string
  public backdrop: string
  public date: Date
  public rank: Number
  public id: Number


  constructor(movie: MovieInterface) {
    this.title = movie.title
    this.overview = movie.overview
    this.backdrop = movie.backdrop
    this.date = movie.date
    this.rank = movie.rank
    this.id = movie.id
  }

}

- la sfrutto nel repository

//importo il modello movie fatto in precedenza
import { Movie } from 'App/Models/Movie'
//importo api helper ovvero uno schema per le richieste api
import ApiHelper from 'App/Helpers/ApiHelper'
//importo env dove avrò la chiave per le richieste api
import Env from '@ioc:Adonis/Core/Env'

class MovieRepository {
  //metto in una variabile l'url base così da non ripeterlo
  private baseUrl = 'https://api.themoviedb.org/3'
  //eseguo chiamata axios
  public async popular(): Promise<Array<Movie>> {
    const response = await ApiHelper({
      //aggiungo la parte di quary per far capire cosa mostrarmi ad axios
      url: `${this.baseUrl}/movie/popular`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
        page: 1,
      },
    })

    return this.makeMovies(response)
  }

  public async findById(id: number): Promise<Movie> {
    const response = await ApiHelper({
      url: `${this.baseUrl}/movie/${id}`,
      params: {
        api_key: Env.get('THEMOVIEDB_API_TOKEN'),
        language: 'it-IT',
      },
    })

    return this.makeMovie(response)
  }

  private makeMovie(data: any): Movie {
    return new Movie({
      title: data.title,
      overview: data.overview,
      backdrop: data.backdrop_path,
      date: data.release_date,
      rank: data.vote_average,
      id: data.id
    })
  }

  private makeMovies(data: any): Array<Movie> {
    return data.results.map((r) => this.makeMovie(r))
  }
}

export default new MovieRepository()

- nel repository inserisco la logica 

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

- infine la utilizzo nel controller 

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MovieService from 'App/services/MovieService'
import SeriesService from 'App/services/SeriesService'

export default class MoviesController {

    public async index({ view }: HttpContextContract) {
        const coverLink = 'http://image.tmdb.org/t/p/w342/'
        const PMovies = await MovieService.popular()
        const PSeries = await SeriesService.popular()
        const active = 'home'
        return await view.render('home',{PMovies,PSeries,coverLink,active})
      }
}

- sulla rotta che chiama l'index di questo controller avrò quindi la variabile Movies che sarà piena di film

# auth

https://adocasts.com/lessons/adonisjs-authentication-in-15-minutes

- installare pacchetto per l'hasing delle password
   -> **npm i phc-argon2**

- installare e configurare il pacchetto auth

//installa
+ npm i @adonisjs/auth
//configura
+ node ace configure @adonisjs/auth

- in start/kernel.ts inserire il middleware silentAuth
->
Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser'),
  () => import('App/Middleware/SilentAuth') // ++
])

- creazione controller auth 
  -> **node ace make:controller Auth**

- renderizzare nel controller le pagine login e register
  ->
   public async registerShow({ view }: HttpContextContract) {
    return view.render('auth/register')
  }

  public async loginShow({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

- creare le rotte per entrambe le pagine
Route.get('register', 'AuthController.registerShow').as('auth.register.show')
Route.get('login', 'AuthController.loginShow').as('auth.login.show')

- crere le pagine eseguendo 
  + **node ace make:view auth/register**
  + **node ace make:view auth/login**

- creo le viste form di registrazione e login 
- eseguo nell'authcontroller la logica che mi permette di registrarmi e loggarmi 

cosa fare nel dettaglio?
Per il nostro metodo di registrazione, stiamo prima creando uno schema di convalida per il nostro utente. Ciò convaliderà che il nostro nome utente e l'e-mail sono univoci, che la nostra e-mail è un'e-mail valida e che la nostra password è lunga almeno 8 caratteri. Quindi, convalidiamo utilizzando il nostro schema utente, che restituisce i dati convalidati. Utilizziamo quindi i dati convalidati per creare il record del nostro utente. Quindi, utilizziamo il nuovo record di quell'utente per accedere all'utente.

Per l'accesso, tutto ciò che stiamo facendo è prendere l'uid e la password dal corpo della richiesta, non è necessario convalidare qui il tentativo di chiamata sarà sufficiente. Quindi forniamo i valori uid e password nella auth.attemptchiamata per tentare di accedere. Se fallisce, catturiamo quell'errore e restituiamo un vago errore flash sulla sessione e respingiamo l'utente alla pagina del modulo.

Per la disconnessione, chiamiamo semplicemente auth.logout, che si occuperà di tutto per noi.

- una volta inserita la logica di questi metodi nel controller specificarne le rotte , ecco le rotte complete
Route.get('register', 'AuthController.registerShow').as('auth.register.show')
Route.post('register', 'AuthController.register').as('auth.register') // ++
Route.get('login', 'AuthController.loginShow').as('auth.login.show')
Route.post('login', 'AuthController.login').as('auth.login')          // ++
Route.get('logout', 'AuthController.logout').as('auth.logout')        // ++

- infine in edge posso usare auth.user per testare l'autentificazione, di conseguenza esempio nella nav sarà

...
 @if (!auth.user)
    <a href="{{ route('auth.register') }}">register</a>
    <a href="{{ route('auth.login') }}">Login</a>
  @endif
    <a href="{{ route('auth.logout') }}">Logout</a>