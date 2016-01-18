#!/usr/bin/env node --harmony_rest_parameters
'use strict';

const google = require('./lib/google.es6');

if (require.main === module) {
  google(process.argv.slice(2));
  return;
}

module.exports = exports = (...query) => google(query);
