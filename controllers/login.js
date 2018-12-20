const { OAuth2Client } = require('google-auth-library');

const User = require('../models/User');

/**
 * POST /login/google
 * Logging with Google
 */
exports.loginWithGoogle = (req, res) => {
  const { token, profile } = req.body;

  const query = { google: profile.id };

  const client = new OAuth2Client(process.env.GOOGLE_ID);
  client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_ID,
  })
    .then((response) => {
      User.findOne(query, (err, existingUser) => {
        if (err) {
          res.status(400);
          res.json({ message: 'saving in db error' });
        } else if (existingUser) {
          res.json(existingUser);
        } else {
          const newUser = new User();

          newUser.email = response.email;
          newUser.google = profile.id;
          newUser.profile = {
            name: profile.name,
          };
          newUser.tokens = [{ kind: 'google', accessToken: token }];

          newUser.save((err, user) => {
            if (err) {
              res.status(400);
              res.json({ message: 'data error!' });
            } else {
              res.json(user);
            }
          });
        }
      });
    })
    .catch(() => {
      res.status(400);
      res.json({ message: 'unknown error!' });
    });
};
