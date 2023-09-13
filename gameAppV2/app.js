//Module de mon app
const express = require('express'); // pour créer le serveur
const mongoose = require('mongoose'); // gestion de la db mongo
const bodyParser = require('body-parser'); // pour données du formulaire


// je crée mon app express
const app = express();


// ?(recommandé par le terminal) éreur de dépréciation donc j'ajoute la ligne suivante 
mongoose.set('strictQuery', true);

// on fait la connexion à mongo 
//mongoose.connect('mongodb://localhost/anime');

mongoose.connect('mongodb://localhost/anime', (err) => {
    if (err) {
        console.error('Err connexion MongoDB:', err);
    } else {
        console.log('connexion MongoDB ok !!');
    }
});

// pour corriger l'éreur de dépréciation j'ajoute la ligne suivante
mongoose.set('strictQuery', true);


//! Modèle qui va etre utisé par Game.find()
const Game = mongoose.model('Game', {
    Title: String,
    'Release Date': String, //? note : les champs avec des espaces doivent etre entre guillemets
    Team: [String],
    Rating: String,
    'Times Listed': String,
    'Number of Reviews': String,
    Genres: [String],
    Summary: String,
    Reviews: [String],
    Plays: String,
    Playing: String,
    Backlogs: String,
    Wishlist: String
}, 'gameDB'); // nom de la collection 

// Configuration de mon app 
app.set('view engine', 'ejs'); // pour preciser j'utilise ejs comme moteur de template
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// Routes
//route page de b'accueil
app.get('/', async (req, res) => { //  asyn evidement pour eviter les pb de blocage
    
    const games = await Game.find(); //ici je recherche tous les jeux de ma db; await pour bloquer le code tant que la requete asyn n'est pas fini

    //TODO console.log(games);
    res.render('index', { games }); // je passe les jeux à ma vue index.ejs, c'est ca qui va me permettre 
                                    // d'utiliser //? <% games.forEach(game... pour les afficher dans ma vue
});

// delete le jeu
app.post('/game/delete', bodyParser.json(), async (req, res) => {
    await Game.deleteOne({ _id: req.body.id });
    res.sendStatus(200);  // bonne pratique pour dire que tout c'est bien passé
});

// j'ajoute d'un nouv jeu, j'ai pas fait de GET je l'affiche direct dans la vue index.ejs
app.post('/game', async (req, res) => { 
    
    const game = new Game(req.body); // je cree une nouvelle instance de jeu avec les données du formulaire
    console.log(req.body)
    await game.save(); // j'enregistre l'instance dans la db
    res.redirect('/');
});



// chemin pour edit le jeu, le lien est dans la vue index.ejs
app.get('/game/edit/:id', async (req, res) => {
    const gameId = req.params.id; // je recup le param id de l'url et attribut à gameId
    const game = await Game.findById(gameId); //maintenant je peux rechercher le jeu par son id
    console.log(game);
    
    if (game) { // Si le jeu existe
        res.render('edit', { game }); // On affiche la page d'édition
    } else { //
        res.status(404).send('Game not found');// Sinon on affiche une erreur
    }
});


// methode post pour edit le jeu dans la db
app.post('/game/edit', async (req, res) => {
    
    const gameData = req.body; // je recup les données du formulaire
    await Game.updateOne({ _id: gameData.id }, gameData); // MAJ le jeu dans la db
    res.redirect('/');
});


// Lancement du serveur
const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Le server run sur le port : ${PORT}`);
});