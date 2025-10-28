const models = require('../models/');

// Création d'un commentaire
exports.createComment = (req, res) => {
    const newComment = {
        userId: req.body.userId,
        content: req.body.content,
        postId: req.body.postId
    };
    models.Comment.create(newComment)
        .then(() => res.status(201).json({ message: "Commentaire créé !" }))
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
            res.status(200).json({message : 'Commentaire supprimé !'})
        } else {
            res.status(401).json({
                message: 'Requête non autorisée !'
            });
        }
    })
    .catch( error => res.status(400).json({error}));
};