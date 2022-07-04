import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//importo le logiche native adonis di schema e regole
import { schema, rules } from '@ioc:Adonis/Core/Validator'
//importo il modello user
import User from 'App/Models/User'
//importo il mail
import Mail from '@ioc:Adonis/Addons/Mail'
//importo il pacchetto di criptazione
import crypto from 'crypto'
import { DateTime } from 'luxon'

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
        .subject('Benvenuto su cinema ok!')
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

  //mostro pagina dove inserire mail
  public async getResetPassword({ view }: HttpContextContract) {
    return view.render('auth/reset-password')
  }

  //logica di invio email e generazione del token
  public async resetPassword({ request, response, session }: HttpContextContract) {
    const email = await request.input('email')
    const user = await User.findBy('email', email)
    const date = DateTime.now().plus({ hours: 1 })
    if (user === null) {
      session.flash('form', 'email non trovata, ritenta assicurandoti di inserire la giusta email')
      return response.redirect().back()
    }
    crypto.randomBytes(32, (err, Buffer) => {
      if (err) {
        console.log(err)
        return response.redirect().back()
      }
      const token = Buffer.toString('hex')
      user.reset_token = token
      user.reset_token_expiration = date
      user.save()
      Mail.send((message) => {
        message
          .from('cinemaok@cinema.com')
          .to(user.email)
          .subject('resetta la password')
          .htmlView('emails/reset-password', { name: user.username, token: token })
      })
    })
    return response.redirect('/login')
  }

  //mostro il form per il reset della password
  public async getFormReset({ view, params, session, response }: HttpContextContract) {
    //estrapolo il token dal parametro
    const token = await params.token
    //cerco l'utente che ha lo stesso token e se lo trovo gli permetto di cambiare password
    const confirmUSer = await User.findBy('reset_token', token)
    if (!confirmUSer) {
      session.flash('form', 'non sei abilitato a cambiare la password, reinserisci la tua email')
      return response.redirect('/reset-password')
    }
    const userId = confirmUSer.id
    return view.render('auth/new-password', { userId })
  }

  //posto la nuova password
  public async postNewPassword({ request, session, response }: HttpContextContract) {
    const id = request.input('userId')
    const password = request.input('password')
    const confirmPassword = request.input('passwordConfirm')
    if (password !== confirmPassword) {
      session.flash('form', 'le password non coincidono, assicurati di usare la giusta password')
      return response.redirect().back()
    }
    const user = await User.findOrFail(id)
    const userSchema = schema.create({
      //valido
      password: schema.string({}, [rules.minLength(8)]),
    })
    //eseguo la validazione
    const validatePassword = await request.validate({ schema: userSchema })
    user.password = validatePassword.password
    user.save()
    session.flash('form', 'password aggiornata')
    return response.redirect('/login')
  }
}
