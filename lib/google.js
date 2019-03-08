'use strict';

function showHelp() {
	return [
		'',
		'  CLI tool to launch Google Search in the default browser',
		'',
		'  Usage: google <search-query>',
		'',
		'  Example Usage:',
		'    google',
		'    google how do I google on google',
		'    google --help',
		'',
		'  Flags:',
		'    -h, --help',
		'      Show this help.',
		''
	].join('\n');
}

function getCommand(os) {
	if (os === 'darwin') {
		return 'open';
	}

	if (os === 'linux') {
		return 'xdg-open';
	}

	if (os === 'win32') {
		return 'explorer';
	}

	return null;
}

function getQuery(raw) {
	return raw.map(s => s.replace(/ /g, '+')).join('+');
}

function search(os, exec, query) {
	const cmd = getCommand(os);
	if (cmd === null) {
		throw new Error('Operating system not supported');
	}

	let fullQuery = [];
	if (query.length) {
		if (query[0].match(/^-(h|-help)$/)) {
			console.info(showHelp());
			return;
		}

		fullQuery = [
			'/search?q',
			'=',
			getQuery(query)
		];
	}

	exec([cmd, ' https://www.google.com'].concat(fullQuery).join(''));
}

module.exports = exports = query => {
	const os	 = require('os').platform();
	const exec = require('child_process').exec;

	search(os, exec, query);
};
exports.getCommand	= getCommand;
exports.getQuery		= getQuery;
exports.showHelp		= showHelp;
exports.search			= search;
