// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// const app = express();

// // Connexion à la base de données MongoDB
// mongoose.connect('mongodb://localhost:27017/mydatabase', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// // Création d'un modèle de schéma pour les documents de la collection
// const formDataSchema = new mongoose.Schema({
//   startDate: Date,
//   endDate: Date,
//   days: [{
//     date: Date,
//     hours: Number,
//     comments: String
//   }],
//   totalHours: Number
// });

// const FormData = mongoose.model('FormData', formDataSchema);

// // Configuration de body-parser pour parser les données du formulaire envoyées par l'application cliente
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// // Définition d'une route POST pour l'API qui enregistre les données du formulaire dans la base de données
// app.post('/api/submitForm', (req, res) => {
//   const formData = new FormData({
//     startDate: req.body.startDate,
//     endDate: req.body.endDate,
//     days: req.body.days,
//     totalHours: req.body.totalHours
//   });
//   formData.save((error) => {
//     if (error) {
//       res.send(error);
//     } else {
//       res.send('Les données du formulaire ont été enregistrées dans la base de données avec succès !');
//     }
//   });
// });

// // Démarrage du serveur
// app.listen(3000, () => {
//   console.log('Le serveur écoute sur le port 5000');
// });