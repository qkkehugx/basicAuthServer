// node dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
// local dependencies

const router = require('./router/index');

//app initialization and config

const app = express();

require('./passport/index');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());

app.use('', router);

const PORT = process.env.PORT || 9090;
const env = process.env.NODE_ENV;
const dbURI = require('./mongooseConfig/index')(env);
const mongooseOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
const mongooseConnection = mongoose.connection;

mongooseConnection.on('open', ()=>{
  console.log(`MongoDB connected to ${dbURI}`);
});
mongooseConnection.on('error', (err)=>{
  throw err;
});

const startServer = () =>{
  return mongoose.connect(dbURI, mongooseOptions).then(()=>{
    return app.listen(PORT, ()=>{
      console.log(`Server listening on PORT ${PORT}`);
    });
  });
};

module.exports = startServer();