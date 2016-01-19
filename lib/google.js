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
  return os === 'darwin' ? 'open'
       : os === 'linux'  ? 'xdg-open'
       : os === 'win32'  ? 'explorer'
       : null;
}

function getQuery(raw) {
  return raw.map((s) => s.replace(/ /g, '+')).join('+');
}

function search(os, exec, query) {
  let cmd = getCommand(os);
  if (cmd === null)
    throw('Operating system not supported');

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

  exec([
    cmd,
    ' ',
    'https://www.google.com',
    ...fullQuery
  ].join(''));
}

module.exports = exports = query => {
  const os   = require('os').platform();
  const exec = require('child_process').exec;

  search(os, exec, query);
};
exports.getCommand  = getCommand;
exports.getQuery    = getQuery;
exports.showHelp    = showHelp;
exports.search      = search;
