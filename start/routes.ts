import Route from '@ioc:Adonis/Core/Route'
import AuthController from 'App/Controllers/Http/AuthController'
import FavoriteController from 'App/Controllers/Http/FavoriteController'
import SocialAuthController from 'App/Controllers/Http/SocialAuthController'
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

//rotta per il search
Route.get('search', 'SearchController.index').as('search.index')

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
//reset password get email form
Route.get('reset-password', 'AuthController.getResetPassword').as('auth.getReset')
//reset password post send email
Route.post('post-reset', 'AuthController.resetPassword').as('auth.postReset')
//reset password get form new password
Route.get('reset-password/:token', 'AuthController.getFormReset').as('auth.getFormReset')
//reset password post del form
Route.post('post-new-password', 'AuthController.postNewPassword').as('auth.postNewPassword')

//rotte social auth
//manda al account google pop up
Route.get('/google/redirect', 'SocialAuthController.redirect').as('google.auth.redirect')
//callback di google
Route.get('/callback/google', 'SocialAuthController.callback').as('google.auth.callback')

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
Route.get('/favorites/:userId', 'FavoriteController.index').as('favorites.index')
//aggiungere record
Route.post('/favorites/add', 'FavoriteController.add').as('favorite.add')
//eliminare record
Route.post('/favorites/delete', 'FavoriteController.delete').as('favorite.delete')
