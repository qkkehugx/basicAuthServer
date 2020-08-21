const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const extractJWT = require('passport-jwt').ExtractJwt;

const authSchema = require('../model/index');

const { pbkdf2Sync, randomBytes } = require('crypto');

passport.serializeUser((user, done)=>{
  done(null, user);
});

passport.deserializeUser((user, done)=>{
  done(null, user);
});

passport.use('register', new localStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
}, (username, password, done)=>{
  authSchema.findOne({username: username})
      .then((user)=>{
        if (user) return done(null, false, {message: 'user exists'});
        const salt = randomBytes(16).toString('hex');
        const hashedPw = pbkdf2Sync(password, salt, 10000, 512, 'sha512')
            .toString('hex');
        const newUser = new authSchema({
          username: username,
          password: hashedPw,
          salt: salt,
        });
        newUser.save(function(err, user){
          if (err) throw err;
          return done(null, user);
        });
      }).catch((err)=>{
        return done(err);
      })
}));

passport.use('login', new localStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
}, (username, password, done)=>{
  authSchema.findOne({username: username})
      .then((user)=>{
        if (!user) return done(null, false, {message: 'bad username'});
        const {salt} = user;
        const hashedPw = pbkdf2Sync(password, salt, 10000, 512, 'sha512')
            .toString('hex');
        if (password !== hashedPw) return done(null, false, {
          message: 'password do not match'
        });
        return done(null, user);
      }).catch((err)=>{
        return done(err);
      })
}));

const secret = require('./index.json').secret;
const opts = {
  jwtFromRequest: extractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: secret,
};

passport.use('jwt', new jwtStrategy(opts, (jwtPayload, done)=>{
  const {id} = jwtPayload;
  authSchema.findById(id)
      .then((user)=>{
        if (user)  return done(null, user);
        return done(null, false);
      });
}));  