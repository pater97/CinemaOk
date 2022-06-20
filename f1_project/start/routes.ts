import Route from '@ioc:Adonis/Core/Route'
// import SerieController from 'App/Controllers/Http/SerieController'
// import MovieController from 'App/Controllers/Http/HomeController'


//rotta home
Route.get('/','HomeController.index')

//rotta index di movie
Route.get('/movies','MovieController.index')
//rotta show di movie
Route.get('movies/:id','MovieController.show')

//rotta index di serie 
Route.get('series','SerieController.index')
//rotta show delle serie
Route.get('series/:id','SerieController.show')

//rotte auth
//mostro form di registrazione
Route.get('register', 'AuthController.registerShow').as('auth.register.show')
//eseguo la logica di registrazione
Route.post('register', 'AuthController.register').as('auth.register') // ++
//mostro il form di log in 
Route.get('login', 'AuthController.loginShow').as('auth.login.show')
//eseguo la logica di log in 
Route.post('login', 'AuthController.login').as('auth.login')          // ++
//logica di logout
Route.get('logout', 'AuthController.logout').as('auth.logout')        // ++