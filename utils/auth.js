const withAuth = (req, res, next) => {
    // send user back to login if not authenticated
    if (!req.session.user_id) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  module.exports = withAuth;  