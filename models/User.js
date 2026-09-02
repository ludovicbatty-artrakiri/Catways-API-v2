const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Modèle Mongoose représentant un utilisateur de la capitainerie.
 * @module models/User
 */

/**
 * @typedef User
 * @property {string} username - Nom d'utilisateur
 * @property {string} email - Adresse email, unique
 * @property {string} password - Mot de passe hashé (jamais renvoyé au client)
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est obligatoire"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'adresse email est obligatoire"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Adresse email invalide'],
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
      select: false,
    },
  },
  { timestamps: true }
);

/**
 * Hook Mongoose exécuté avant chaque sauvegarde : hash le mot de passe
 * avec bcrypt s'il a été modifié (création ou mise à jour du mot de passe).
 */
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/**
 * Compare un mot de passe en clair avec le hash stocké en base.
 * @param {string} candidatePassword - Mot de passe saisi par l'utilisateur
 * @returns {Promise<boolean>} true si le mot de passe correspond
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Ne jamais renvoyer le password dans les réponses JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
