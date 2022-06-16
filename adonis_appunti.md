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