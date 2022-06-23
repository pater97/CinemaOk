import Route from '@ioc:Adonis/Core/Route'
import FavoriteController from 'App/Controllers/Http/FavoriteController'
// import SerieController from 'App/Controllers/Http/SerieController'
// import MovieController from 'App/Controllers/Http/HomeController'

//rotta home
Route.get('/', 'HomeController.index').as('home')

//rotta index di movie
Route.get('/movies', 'MovieController.index').as('movies.index')
//rotta show di movie
Route.get('movies/:id', 'MovieController.show').as('movies.show')

//rotta index di serie
Route.get('series', 'SerieController.index').as('series.index')
//rotta show delle serie
Route.get('series/:id', 'SerieController.show').as('series.show')

//rotte auth
//mostro form di registrazione
Route.get('register', 'AuthController.registerShow').as('auth.register.show')
//eseguo la logica di registrazione
Route.post('register', 'AuthController.register').as('auth.register') // ++
//mostro il form di log in
Route.get('login', 'AuthController.loginShow').as('auth.login.show')
//eseguo la logica di log in
Route.post('login', 'AuthController.login').as('auth.login') // ++
//logica di logout
Route.get('logout', 'AuthController.logout').as('auth.logout') // ++

//rotta datatables
Route.post('users/data-table', 'UsersController.dataTables').as('users.dataTable')

//rotte admin
Route.group(() => {
  //index admin
  Route.get('/', 'UsersController.index').as('admin.index')
  //mostra il form di creazione
  Route.get('/create', 'UsersController.showCreate').as('admin.create')
  //store del form
  Route.post('/create', 'UsersController.store').as('admin.store')
  //form update
  Route.get('/edit/:id', 'UsersController.edit').as('admin.edit')
  //store dell'update
  Route.post('/update', 'UsersController.update').as('admin.update')
  //rotta delete
  Route.post('/delete', 'UsersController.destroy').as('admin.delete')
}).prefix('/admin')

//rotte favorites
Route.get('/favorites', 'FavoriteController.index').as('favorites.index')
//aggiungere record
Route.post('/favorites/add', 'FavoriteController.add').as('favorite.add')
