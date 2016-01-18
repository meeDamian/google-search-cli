#!/usr/bin/env node --harmony_rest_parameters
(function() {
  'use strict';

  const google = require('./lib/google.js');

  if (require.main === module) {
    google(process.argv.slice(2));
    return;
  }

  module.exports = exports = (...query) => google(query);
}());
