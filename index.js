#!/usr/bin/env node --harmony_rest_parameters

'use strict';

const google = require('./lib/google.js');

if (require.main === module) {
	google(process.argv.slice(2));
	process.exit();
}

module.exports = exports = (...query) => google(query);
