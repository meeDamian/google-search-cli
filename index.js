#!/usr/bin/env node --harmony_destructuring
(function({exec}, os) {
  'use strict';

  let cmd = os.platform() === 'darwin' ? 'open'
          : os.platform() === 'linux'  ? 'xdg-open'
          : os.platform() === 'win32'  ? 'explorer'
          : null;

  if (cmd === null) {
    console.log('Operating system not supported');
    return;
  }

  exec([
    cmd,
    ' ',
    'https://www.google.com/search?q',
    '=',
    process.argv
      .slice(2)
      .map((s) => s.replace(/ /g, '+'))
      .join('+')
  ].join(''));
})(require('child_process'), require('os'));
