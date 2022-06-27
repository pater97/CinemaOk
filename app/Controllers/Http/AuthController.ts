import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//importo le logiche native adonis di schema e regole
import { schema, rules } from '@ioc:Adonis/Core/Validator'
//importo il modello user
import User from 'App/Models/User'
//importo il mail
import Mail from '@ioc:Adonis/Addons/Mail'

export default class AuthController {
  //mostra pagina di registrazione
  public async registerShow({ view }: HttpContextContract) {
    return view.render('auth/register')
  }

  //logica per la registrazione
  public async register({ request, response, auth }: HttpContextContract) {
    //estrapolo output admin
    const isAdminInput = request.input('is_admin')
    //definisco la variabile
    let is_admin = false
    //se la chiave è uguale lo abilito ad admin
    if (isAdminInput === 'sonoadmin') {
      is_admin = true
    }
    console.log(is_admin)
    // creo lo schema di validazione
    const userSchema = schema.create({
      //valido
      username: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      ]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      ]),
      password: schema.string({}, [rules.minLength(8)]),
    })

    //eseguo la validazione e nel caso fallisse sarò riportato alla pagina di registrazione
    const data = await request.validate({ schema: userSchema })
    //aggiungo ai dati validati anche la caratteristica admin
    data['is_admin'] = is_admin
    //creo un nuovo record con i dati validati
    const user = await User.create(data)

    //lascio autenticato l'utente appena registrato
    await auth.login(user)
    await Mail.send((message) => {
      message
        .from('cinemaok@cinema.com')
        .to(user.email)
        .subject('Welcome Onboard!')
        .htmlView('emails/welcome', { name: user.username })
    })
    console.log('fatto')
    //rendirizzo alla home page
    return response.redirect('/')
  }

  //mostro la pagina di log in
  public async loginShow({ view }: HttpContextContract) {
    return view.render('auth/login')
  }

  //logica per il log in
  public async login({ request, response, auth, session }: HttpContextContract) {
    // estrapola i valori di uid e password
    const { uid, password } = request.only(['uid', 'password'])

    try {
      //prova di autentificazione se funzione reindirrizo alla home senò rendizzo alla pagina login dando errore
      await auth.attempt(uid, password)
    } catch (error) {
      // if login fails, return vague form message and redirect back
      session.flash('form', 'i dati inseriti non sono corretti')
      return response.redirect().back()
    }

    // otherwise, redirect to home page
    return response.redirect('/')
  }

  //logout
  public async logout({ response, auth }: HttpContextContract) {
    //eseguo il logout
    await auth.logout()

    // vengo rindirizzato al login
    return response.redirect().toRoute('auth.login.show')
  }
}
