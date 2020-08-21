const fs = require('fs');

const configPath = __dirname + '/index.json';
module.exports = (env) =>{
  const validEnvironments = ['production', 'testing', 'development'];
  if (!env || typeof env !== 'string') throw new Error('Invalid arguments passed');
  if (!(validEnvironments.includes(env))) throw new Error('Invalid environment');
  const parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return parsed[env];
};