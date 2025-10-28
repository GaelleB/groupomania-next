const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

// Models
const models = require('../models')
const User = models.User;

// Enregistrement d'un compte
exports.signup = (req, res, next) => {
    // Vérifier si les données sont correcte
    const regexText = /^[a-zA-Z-\s]{2,}$/;
    const regexEmail = /^([a-zA-Z0-9.-_]+)@((?:[a-zA-Z0-9.-_]+.)+)([a-zA-Z]{2,4})/;

    if (regexText.test(req.body.nom) === false) {
        return res.status(401).json({message: "Votre nom doit comporter au minimum 2 lettre et ne doit pas comporter de chiffres ou de caractères spéciaux autre que -"})
    }
    else if (regexText.test(req.body.prenom) === false) {
        return res.status(401).json({message: "Votre prenom doit comporter au minimum 2 lettre et ne doit pas comporter de chiffres ou de caractères spéciaux autre que -"})
    }
    else if (regexEmail.test(req.body.email) === false) {
        return res.status(401).json({message: "Ce format d'email n'est pas valide"})
    } 

    if(
        req.body.password.length < 6 
        ||/[a-z]/.test(req.body.password) === false 
        || /[A-Z]/.test(req.body.password) === false 
        || /\d/.test(req.body.password) === false
    ){
        return res.status(401).json({message: "Votre mot de passe doit contenir au minimum une majuscule, une minuscule, un chiffre et doit faire 6 caractères de long"})
    }

    // Crypte le mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // Création d'un nouvel utilisateur (mail + mot de passe)
        const user = new User({
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            password: hash
        });
        // Enregistrement de l'utilisateur 
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
    })
    // Erreur server
    .catch(error => res.status(500).json({ error }));
};

// Connexion au compte
exports.login = (req, res, next) => {
    console.log(req.body.email)
    console.log(req.body.password)
    User.findOne ({  where: { email: req.body.email } })
        .then(user => {
            console.log(user)
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        // Comparaison du mot de passe entré avec celui enregistré
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            // Contient l'identifiant de l'utilisateur et un token
            res.status(200).json({ 
                userId: user.id,
                // Encode un nouveau token grâce à jswonwebtoken
                token: jwt.sign(
                    { userId: user.id },
                    'SECRET_TOKEN',
                    { expiresIn: '8h' } // Reconnexion dans 8h
                )
            });
            console.log(user._id)
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Affichage d'un utilisateur
exports.getOneUser = (req, res, next) => {
    const userId = req.params.id;
    User.findOne({
        attributes: ['nom', 'prenom', 'id', 'email'],
        where: { id: userId }
    }).then((user) => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ 'erreur': 'Utilisateur introuvable !' })
        }
    }).catch(err => res.status(500).json({ err }))
}

// Affichage de tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
    const userId = req.params.id;
    User.findAll()
        .then((users) => res.status(200).json(users))
        .catch((error) => res.status(400).json(error))
};

// Modification de l'utilisateur
exports.modifyUser = (req, res, next) => {
    const userId = req.params.id;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;

    models.User.findOne({
        where: { id: userId },
    })
    .then((user) => {
        user.update({
            nom: nom,
            prenom: prenom,
            email: email,
        })
        .then((user) => {
            if (user) return res.status(201).json(user);
            else return res
            .status(500)
            .json({ error: "Mise à jour du profil impossible" });
        })
        .catch(() => {
            res.status(500).json({ error: "Mise à jour impossible" });
        });
    })
    .catch(() => res.status(500).json({ error: "Vérification impossible" }));
};

// Suppression de l'utilisateur
exports.deleteUser = (req, res, next) => {
    User.findOne ({ where: { id:  req.params.id } })
        .then(user => {
            if(user!= null){
                User.destroy({ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
                .catch(error =>{ console.log(error); res.status(400).json({ message : error.message })});
            }
            else{  console.log("user not found");
                res.status(404).json({ 'erreur': 'Utilisateur non trouvé !' })
            }
        } ).catch(error => {  res.status(500).json({ message : error.message }) })
};