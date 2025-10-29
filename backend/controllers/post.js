const fs = require('fs');
const path = require('path');
const models = require('../models');

const deleteImageIfExists = (imageUrl) => {
  if (!imageUrl) return;
  const parts = imageUrl.split('/images/');
  if (parts.length !== 2) return;

  const filename = parts[1];
  const filepath = path.join('images', filename);

  fs.unlink(filepath, (err) => {
    if (err) {
      console.error('Erreur lors de la suppression du fichier:', err);
    }
  });
};

// Creation d'un post
exports.createPost = (req, res) => {
  const rawTitle = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  const rawContent =
    typeof req.body.content === 'string' ? req.body.content.trim() : '';

  if (!rawContent) {
    return res.status(400).json({ message: 'Le contenu est requis' });
  }

  const newPost = {
    UserId: req.tokenUserId,
    title: rawTitle,
    content: rawContent,
  };

  if (req.file) {
    newPost.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }

  models.Post.create(newPost)
    .then(() => res.status(201).json({ message: 'Post cree !' }))
    .catch((error) => res.status(500).json({ error }));
};

// Affichage d'un post
exports.getOnePost = (req, res) => {
  const postId = req.params.id;
  models.Post.findOne({
    where: { id: postId },
    include: [
      {
        model: models.User,
        as: 'User',
        attributes: ['prenom', 'nom'],
      },
      {
        model: models.Like,
        attributes: ['PostId', 'UserId'],
      },
      {
        model: models.Dislike,
        attributes: ['PostId', 'UserId'],
      },
      {
        model: models.Comment,
        attributes: ['content', 'id', 'UserId', 'PostId'],
      },
    ],
  })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

// Affichage de tous les posts
exports.getAllPosts = (req, res) => {
  models.Post.findAll({
    order: [['id', 'DESC']],
    include: [
      {
        model: models.User,
        as: 'User',
        attributes: ['prenom', 'nom'],
      },
      {
        model: models.Like,
        attributes: ['PostId', 'UserId'],
      },
      {
        model: models.Dislike,
        attributes: ['PostId', 'UserId'],
      },
      {
        model: models.Comment,
        attributes: ['content', 'id', 'UserId', 'PostId'],
        include: [
          {
            model: models.User,
            attributes: ['nom', 'prenom', 'id'],
          },
        ],
      },
    ],
  })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json({ error }));
};

// Modification d'un post (contenu)
exports.modifyPost = (req, res) => {
  const postId = req.params.id;
  const hasTitle = typeof req.body.title === 'string';
  const hasContent = typeof req.body.content === 'string';
  const cleanTitle = hasTitle ? req.body.title.trim() : undefined;
  const cleanContent = hasContent ? req.body.content.trim() : undefined;
  const removeImageFlag =
    typeof req.body.removeImage === 'string' &&
    ['true', '1', 'on', 'yes'].includes(req.body.removeImage.toLowerCase());

  const userIdRequest = req.tokenUserId;

  models.Post.findOne({ where: { id: postId } })
    .then((post) => {
      if (post.UserId !== userIdRequest) {
        return res.status(401).json({ message: "Ce n'est pas votre message" });
      }

      const updatePost = {};

      if (hasTitle) {
        updatePost.title = cleanTitle ?? '';
      }

      if (hasContent) {
        if (!cleanContent) {
          return res.status(400).json({ message: 'Le contenu est requis' });
        }
        updatePost.content = cleanContent;
      }

      const shouldDeleteExistingImage = (removeImageFlag || !!req.file) && post.image;
      if (shouldDeleteExistingImage) {
        deleteImageIfExists(post.image);
      }

      if (req.file) {
        updatePost.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
      } else if (removeImageFlag) {
        updatePost.image = null;
      }

      if (Object.keys(updatePost).length === 0) {
        return res.status(400).json({ message: 'Aucune modification fournie' });
      }

      return models.Post.update(
        {
          ...updatePost,
          id: postId,
        },
        { where: { id: postId } },
      )
        .then(() => res.status(200).json({ message: 'Post modifie !' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Suppression d'un post
exports.deletePost = (req, res) => {
  const userIdRequest = req.tokenUserId;

  models.Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (post.UserId !== userIdRequest) {
        return res.status(401).json({ message: "Ce n'est pas votre message" });
      }

      deleteImageIfExists(post.image);

      return models.Post.destroy({ where: { id: req.params.id } })
        .then(() => res.status(201).json({ message: 'Post supprime' }))
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// Like
exports.likePost = async (req, res) => {
  try {
    const userId = req.tokenUserId;
    const postId = req.params.id;
    const userLike = await models.Like.findOne({
      where: { UserId: userId, PostId: postId },
    });

    const userDislike = await models.Dislike.findOne({
      where: { UserId: userId, PostId: postId },
    });

    if (userDislike) {
      await userDislike.destroy();
    }

    if (userLike) {
      await models.Like.destroy({ where: { UserId: userId, PostId: postId } });
      return res.status(200).send({ message: 'Neutre' });
    }

    await models.Like.create({
      UserId: userId,
      PostId: postId,
    });
    return res.status(201).json({ message: 'Like :)' });
  } catch (error) {
    return res.status(500).send({ error: 'Erreur du serveur' });
  }
};

// Dislike
exports.dislikePost = async (req, res) => {
  try {
    const userId = req.tokenUserId;
    const postId = req.params.id;
    const userDislike = await models.Dislike.findOne({
      where: { UserId: userId, PostId: postId },
    });

    const userLike = await models.Like.findOne({
      where: { UserId: userId, PostId: postId },
    });

    if (userLike) {
      await userLike.destroy();
    }

    if (userDislike) {
      await models.Dislike.destroy({ where: { UserId: userId, PostId: postId } });
      return res.status(200).send({ message: 'Neutre' });
    }

    await models.Dislike.create({
      UserId: userId,
      PostId: postId,
    });
    return res.status(201).json({ message: 'Dislike :(' });
  } catch (error) {
    return res.status(500).send({ error: 'Erreur du serveur' });
  }
};
