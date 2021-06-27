const router = require('express').Router();
const { User, Post, Comment, Vote } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
      })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { 
            exclude: ['password']
        },
        where: {
          id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id','title','post_url','createdAt']
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            },
            {
                model: Comment,
                attributes: ['comment_text','createdAt']
            }
        ]
      })
    .then(dbUserData => {
        if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/username/:username
router.get('/username/:username', (req, res) => {
  User.findOne({
      attributes: { 
          exclude: ['password']
      },
      where: {
        username: req.params.username
      },
      include: [
          {
              model: Post,
              attributes: ['id','title','post_url','createdAt']
          },
          {
              model: Post,
              attributes: ['title'],
              through: Vote,
              as: 'voted_posts'
          },
          {
              model: Comment,
              attributes: ['comment_text','createdAt']
          }
      ]
    })
  .then(dbUserData => {
      if (!dbUserData) {
      res.status(404).json({ message: 'No user found with this username' });
      return;
      }
      res.json(dbUserData);
  })
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

// POST /api/users
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/user/login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
          username: req.body.username
        }
    })
    .then(dbUserData => {

        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!dbUserData || !validPassword) {
          // consolidate the validation so that we don't reveal whether the username or the passowrd are incorrect #bestpractice
          res.status(400).json({ message: 'Invalid credentials' });
          return;
        }
    
        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
      
          res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// POST /api/users/logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    }
    else {
      res.status(404).end();
    }
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
          id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
          id: req.params.id
        }
      })
    .then(dbUserData => {
        if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;