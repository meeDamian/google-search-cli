#!/usr/bin/env node

'use strict';

const google = require('./lib/google.js');

if (require.main === module) {
	google(process.argv.slice(2));
	process.exit();
}

module.exports = exports = function () {
	google.apply(null, arguments);
};
