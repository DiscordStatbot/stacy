// MongoDB connection file. Required for connection to the database.

'use strict';

const mongoose = require('mongoose');
const { mongoURI } = require('../config');

module.exports = {
  init: () => {
    const dbOptions = {
      useNewUrlParser: true,
      autoIndex: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
    };

    mongoose.connect(mongoURI, dbOptions);
    mongoose.set('useFindAndModify', false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {
      console.log(' [DB] StacyDB connected');
    });

    mongoose.connection.on('err', (err) => {
      console.error(` [DB] StacyDB connection error: \n ${err.stack}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log(' [DB]  StacyDB disconnected');
    });
  },
};
