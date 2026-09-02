/**
 * Usage : node scripts/createAdmin.js <username> <email> <password>
 * Crée un utilisateur directement en base, utile pour disposer
 * d'un premier compte de connexion (livrable attendu du brief).
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  const [, , username, email, password] = process.argv;
  if (!username || !email || !password) {
    console.log('Usage: node scripts/createAdmin.js <username> <email> <password>');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Un utilisateur avec cet email existe déjà.');
    process.exit(0);
  }

  const user = await User.create({ username, email, password });
  console.log('Utilisateur créé :', user.email);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
