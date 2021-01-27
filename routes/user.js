const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login',
  function (req, res) {
    res.render('user/login')
  })

  router.post('api/user/login',
  passport.authenticate(
    'local',
    {
      failureRedirect: '/user/login',
    },
  ),
  function (req, res) {
    console.log("req.user: ", req.user)
    res.redirect('/')
  })

  router.get('/logout',
  function (req, res) {
    req.logout()
    res.redirect('/')
  })

  router.get('/profile',
  function (req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (req.session) {
        req.session.returnTo = req.originalUrl || req.url
      }
      return res.redirect('user/login')
    }
    next()
  },
  function (req, res) {
    res.render('user/profile', { user: req.user })
  })
module.exports = router;