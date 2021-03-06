const router = require('express').Router();
const session = require('express-session');
const sequelize = require('../../config/connection');
const { Post, User, Comment, Vote } = require('../../models');

// get all posts for homepage
router.get('/', (req, res) => {
  console.log('======================');
  let user_id = req.session.user_id ? req.session.user_id : null;
  Post.findAll({
    attributes: [
      'id',
      'post_url',
      'title',
      'post_text',
      'createdAt',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
      [sequelize.literal('(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)'), 'comment_count'],
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE (vote.user_id = ' + user_id + ' AND vote.post_id = post.id))'), 'liked']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'createdAt'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));
      res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get single post
router.get('/post/:id', (req, res) => {
  let user_id = req.session.user_id ? req.session.user_id : null;
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'post_text',
      'createdAt',
      'user_id',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'],
      [sequelize.literal('(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id)'), 'comment_count'],
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE (vote.user_id = ' + user_id + ' AND vote.post_id = post.id))'), 'liked']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'createdAt'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      const post = dbPostData.get({ plain: true });
      console.log(post);
      res.render('single-post', {
        post,
        loggedIn: req.session.loggedIn,
        userId: req.session.user_id
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// login
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// signup
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;
