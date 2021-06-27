const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment, Vote } = require('../../models');
const withAuth = require('../../utils/auth');

// POST /api/comments
router.post('/', withAuth, (req, res) => {
    Comment.create({
        post_id: req.body.post_id,
        user_id: req.session.user_id,
        comment_text: req.body.comment_text
      })
    .then(dbData => res.json(dbData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;