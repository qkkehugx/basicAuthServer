const passport = require('passport');
const authSchema = require('../model/index');
const jwt = require('jsonwebtoken');

function register(req, res, next) {
  const handler = passport.authenticate('register', (err, user, info)=>{
    if (err) return next(err);
    if (info) {
      const {message} = info;
      return res.status(409).json({message});
    };
    req.logIn((user, err)=>{
      if (err) return next(err);
      const {_id, username} = user;
      return res.status(200).json({
        _id,
        username,
      });
    });
  });
  return handler(req,res, next);
};

const secret = require('../passport/index.json').secret;

function login(req, res, next) {
  const handler = passport.authenticate('login', (err, user, info)=>{
    if (err) return next(err);
    if (info) {
      const {message} = info;
      return res.status(401).json({message});
    };
    req.logIn((user, err)=>{
      const {_id} = user;
      const token = jwt.sign({id: _id}, secret);
      return res.status(200).json({
        auth: true,
        message: 'user logged in',
        token,
      });
    });
  });
  return handler(req, res, next);
};
function findUser(req, res, next) {
}

module.exports = {
  register,
  login,
  findUser,
};