const models = require('../models/');

// Création d'un commentaire
exports.createComment = (req, res) => {
    const newComment = {
        userId: req.tokenUserId,
        content: req.body.content,
        postId: req.body.postId
    };
    models.Comment.create(newComment)
        .then((comment) => {
            // Récupérer le commentaire avec les infos utilisateur
            return models.Comment.findOne({
                where: { id: comment.id },
                include: [{
                    model: models.User,
                    attributes: ['nom', 'prenom', 'id']
                }]
            });
        })
        .then((commentWithUser) => res.status(201).json({ message: "Commentaire créé !", data: commentWithUser }))
        .catch(error => res.status(500).json({ error }));
};

// Affichage des commentaires sur un post
exports.getPostComment = (req, res) => {
    models.Comment.findAll({
        where: { postId : req.params.postId },
        include: [{  model : models.User}],
        order: [["createdAt", "DESC"]]
    })
    .then(comments => res.status(200).json(comments))
    .catch( error => res.status(400).json({error}))
};

// Modification d'un commentaire
exports.modifyComment = (req, res) => {
    models.Comment.findOne({
        where: { id: req.params.id },
    })
    .then(comment => {
        if (!comment) {
            return res.status(404).json({ message: 'Commentaire introuvable !' });
        }
        if (comment.userId !== req.tokenUserId) {
            return res.status(401).json({ message: 'Requête non autorisée !' });
        }
        if (!req.body.content || !req.body.content.trim()) {
            return res.status(400).json({ message: 'Le contenu est requis' });
        }
        models.Comment.update(
            { content: req.body.content },
            { where: { id: req.params.id } }
        )
        .then(() => res.status(200).json({ message: 'Commentaire modifié !' }))
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

// Suppression d'un commentaire
exports.deleteComment = (req, res) => {
    models.Comment.findOne({
        where: { id: req.params.id },
        include: [{ model : models.User }],
    })
    .then(Comment => {
        if (Comment.userId === req.tokenUserId)
        {
            models.Comment.destroy({ where: { id: req.params.id } })
            .then(() => res.status(200).json({message : 'Commentaire supprimé !'}))
            .catch(error => res.status(500).json({error}));
        } else {
            res.status(401).json({
                message: 'Requête non autorisée !'
            });
        }
    })
    .catch( error => res.status(400).json({error}));
};