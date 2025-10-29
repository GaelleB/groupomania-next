const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const models = require('../models');
const User = models.User;

const namePattern = /^[\p{L}\s'-]{2,}$/u;
const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,})$/;

exports.signup = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!namePattern.test(nom || '')) {
    return res.status(400).json({
      message:
        'Votre nom doit comporter au minimum 2 lettres et ne doit pas contenir de chiffres.',
    });
  }

  if (!namePattern.test(prenom || '')) {
    return res.status(400).json({
      message:
        'Votre prénom doit comporter au minimum 2 lettres et ne doit pas contenir de chiffres.',
    });
  }

  if (!emailPattern.test(email || '')) {
    return res.status(400).json({ message: "Ce format d'email n'est pas valide." });
  }

  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return res.status(400).json({
      message:
        'Votre mot de passe doit contenir au minimum une majuscule, une minuscule, un chiffre et doit faire 6 caractères ou plus.',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      userId: user.id,
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'SECRET_TOKEN', {
        expiresIn: '8h',
      }),
      message: 'Utilisateur créé.',
    });
  } catch (error) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Un compte existe déjà avec cet email.' });
    }
    return res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé.' });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    return res.status(200).json({
      userId: user.id,
      token: jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'SECRET_TOKEN', {
        expiresIn: '8h',
      }),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findOne({
      attributes: ['nom', 'prenom', 'id', 'email', 'role', 'image'],
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
};

exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
};

exports.modifyUser = async (req, res) => {
  const userId = req.params.id;

  if (req.tokenUserId !== Number(userId)) {
    return res.status(403).json({ message: 'Non autorisé à modifier ce profil.' });
  }

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    await user.update({
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  if (req.tokenUserId !== Number(req.params.id)) {
    return res.status(403).json({ message: 'Non autorisé à supprimer ce compte.' });
  }

  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    await User.destroy({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Utilisateur supprimé.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', details: error.message });
  }
};
