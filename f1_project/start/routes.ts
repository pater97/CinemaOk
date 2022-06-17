import Route from '@ioc:Adonis/Core/Route'
// import MovieController from 'App/Controllers/Http/HomeController'


//rotta home
Route.get('/','HomeController.index')

//rotta index di movie
Route.get('/movies','MovieController.index').as('index')
//rotta show di movie
Route.get('movies/:id','MovieController.show').as('show')