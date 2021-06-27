const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment, Vote } = require('../../models');
const withAuth = require('../../utils/auth');

// POST /api/posts
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        post_text: req.body.post_text,
        user_id: req.session.user_id
      })
    .then(dbData => res.json(dbData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.put('/upvote', withAuth, (req, res) => {
  // check if user already liked this post
  Vote.findOne({
    where: {
      post_id: req.body.post_id,
      user_id: req.session.user_id
    }
  })
  .then(results => {
    if(!results) {
      // custom static method created in models/Post.js
      Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
      .then(updatedVoteData => res.json(updatedVoteData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
    } else {
      Vote.destroy({
        where: {
          id: results.id
        }
      })
      .then(deletedVoteData => res.json(this.deletedVoteData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
    }
  });

  
});

// PUT /api/posts/:id
router.put('/:id', withAuth, (req, res) => {
    Post.update({
        title: req.body.title,
        post_url: req.body.post_url,
        post_text: req.body.post_text,
        user_id: req.session.user_id
      },
      {
        where: {
          id: req.params.id
        }
      })
    .then(dbData => res.json(dbData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/posts/1
router.delete('/:id', (req, res) => {
  Post.destroy({
      where: {
        id: req.params.id
      }
    })
  .then(dbData => {
      if (!dbData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
      }
      res.json(dbData);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

module.exports = router;