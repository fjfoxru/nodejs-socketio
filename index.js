const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
const {Users} = require('./models');


const Password = 'qwe321QWE321';
const Name = 'nodejs-mongo';
const UrlDB = `mongodb+srv://nodejs-mongo-admin:${Password}@cluster0.jsjpu.mongodb.net/${Name}?retryWrites=true&w=majority`

const loggerMiddleware = require('./middleware/logger');
const errorMiddleware = require('./middleware/error');

const indexRouter = require('./routes/index');
const booksApiRouter = require('./routes/api/books');
const booksRouter = require('./routes/books');
const userRouter = require('./routes/user');

const app = express();
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(loggerMiddleware);

app.use('/files', express.static(__dirname+'/public'));




/**
 * @param {String} username
 * @param {String} password
 * @param {Function} done
 */

function verify (username, password, done) {
    Users.findByUsername(username, function (err, user) {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
  
      if (!Users.verifyPassword(user, password)) { return done(null, false) }
  
      return done(null, user)
    })
  }
  const options = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: false,
  }
  passport.use('local', new LocalStrategy(options, verify));

  passport.serializeUser(function (user, cb) {
    cb(null, user.id)
  })
  
  passport.deserializeUser(function (id, cb) {
    db.users.findById(id, function (err, user) {
      if (err) { return cb(err) }
      cb(null, user)
    })
  })

  app.use(require('express-session', { secret: 'somevalue' })({
    secret: 'test',
    resave: false,
    saveUninitialized: false,
  }))

  app.use(passport.initialize())
  app.use(passport.session())

app.use('/', indexRouter);
app.use('/api/books', booksApiRouter);
app.use('/books', booksRouter);
app.use('/user', userRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        await mongoose.connect(UrlDB);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }}
    start();