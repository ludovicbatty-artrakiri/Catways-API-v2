const mongoose = require('mongoose');

// Si la BDD n'est pas connectée, on veut une erreur immédiate et claire
// plutôt qu'un blocage silencieux de ~10s sur chaque requête (comportement
// par défaut de Mongoose, qui masque le vrai problème).
mongoose.set('bufferCommands', false);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connecté avec succès');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
