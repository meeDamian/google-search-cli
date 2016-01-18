#!/usr/bin/env node
(function(exec, os) {
  'use strict';

  let cmd = os.platform() === 'darwin' ? 'open'
          : os.platform() === 'linux'  ? 'xdg-open'
          : os.platform() === 'win32'  ? 'explorer'
          : null;

  if (cmd === null) {
    console.log('Operating system not supported');
    return;
  }

  let query = process.argv.slice(2);
  if (query[0] === '--help' || query[0] === '-h') {
    console.log([
      '',
      '$ google --help',
      '',
      'CLI tool to launch Google Search in the default browser',
      '',
      'Usage: google <search-query>',
      '',
      'Example Usage:',
      '  google',
      '  google how do I google on google',
      '  google --help',
      '',
      'Flags:',
      '  -h, --help',
      '    Show this help.',
      '',
    ].join('\n'));
    return;
  }

  exec([
    cmd,
    ' ',
    'https://www.google.com/search?q',
    '=',
    query
      .map((s) => s.replace(/ /g, '+'))
      .join('+')
  ].join(''));
})(require('child_process').exec, require('os'));
