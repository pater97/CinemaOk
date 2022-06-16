import Route from '@ioc:Adonis/Core/Route'

// import MoviesController from '../app/Controllers/Http/MoviesController'

//rotta home
Route.get('/','MoviesController.index').as('index')
