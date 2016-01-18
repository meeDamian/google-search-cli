'use strict';

const should    = require('chai').should();

const google    = require('../lib/google.js');
const execMock  = (fn) => (param) => fn(param);

let ex = (q) => ' (ex. `$ google ' + q + '`)';

describe('google-search-cli', () => {

  it('should be a function', () => {
    should.exist(google);
    google.should.be.a('function');
  });

  describe('#showHelp', () => {
    let helpStr = google.showHelp();

    it('should return a help string', () => {
      should.exist(helpStr);
      helpStr.should.be.a('string');
    });

    it('should contain all important keywords', () => {
      helpStr.should.include('-h')
        .and.include('--help')
        .and.include('Usage: google')
        .and.include('Example Usage:')
        .and.include('Flags:')
        .and.include('Google Search')
        .and.include('browser');
    });
  });

  describe('#getCommand', () => {
    it('should return correct command for OSX', () => {
      let cmd = google.getCommand('darwin');

      should.exist(cmd);
      cmd.should.be.a('string');
      cmd.should.be.equal('open');
    });

    it('should return correct command for Linux', () => {
      let cmd = google.getCommand('linux');

      should.exist(cmd);
      cmd.should.be.a('string');
      cmd.should.be.equal('xdg-open');
    });

    it('should return correct command for Windows', () => {
      let cmd = google.getCommand('win32');

      should.exist(cmd);
      cmd.should.be.a('string');
      cmd.should.be.equal('explorer');
    });

    it('should return null for else', () => {
      let cmd = google.getCommand('darlinux32');

      should.not.exist(cmd);
    });
  });

  describe('#getQuery', () => {
    const STR_NO_SPACE  = 'spacelessstring';
    const STR_SPACES    = 'string with spaces';
    const STR_PLUSES    = 'string+with+spaces';

    it('should leave spaceless string untouched' + ex(STR_NO_SPACE), () => {
      let query = google.getQuery([STR_NO_SPACE]);

      should.exist(query);
      query.should.be.a('string');
      query.should.be.equal(STR_NO_SPACE);
    });

    it('should plussify spaces in a quoted string' + ex('"' + STR_SPACES + '"'), () => {
      let query = google.getQuery([STR_SPACES]);

      should.exist(query);
      query.should.be.a('string');
      query.should.be.equal(STR_PLUSES);
    });

    it('should plussify spaces in a simple query' + ex(STR_SPACES), () => {
      let query = google.getQuery(STR_SPACES.split(' '));

      should.exist(query);
      query.should.be.a('string');
      query.should.be.equal(STR_PLUSES);
    });

    it('should plussify spaces in a mixed query' + ex('"' + STR_SPACES + '" ' + STR_SPACES + ' ' + STR_NO_SPACE), () => {
      let query = google.getQuery([STR_SPACES, ...STR_SPACES.split(' '), STR_NO_SPACE]);

      should.exist(query);
      query.should.be.a('string');
      query.should.be.equal([
        STR_PLUSES,
        STR_PLUSES,
        STR_NO_SPACE
      ].join('+'));
    });
  });

  describe('#search', () => {
    let tmpConsoleInfo;

    before(() => {
      tmpConsoleInfo = console.info;
      console.info = () => {};
    });
    after(() => console.info = tmpConsoleInfo);

    it('should fail for unsupported OS', () => {
      let fn = () => google.search('amiga', null, null);
      fn.should.throw('Operating system not supported');
    });

    it('should not call exec on -h', (done) => {
      google.search('darwin', execMock(() => done(new Error)), ['-h']);
      setTimeout(done, 10);
    });

    it('should not call exec on --help', (done) => {
      google.search('darwin', execMock(() => done(new Error)), ['--help']);
      setTimeout(done, 10);
    });

    it('should call exec with vanilla link on empty query', (done) => {
      let fn = execMock((str) => {
        should.exist(str);
        str.should.be.a('string');
        str.should.match(/^[\w\-]{4,8} https?:\/\/(www\.)?google\.com$/i);
        done();
      });

      google.search('linux', fn, []);
      setTimeout(() => done(new Error), 10);
    });

    it('should call exec with plussified query on query', (done) => {
      let fn = execMock((str) => {
        should.exist(str);
        str.should.be.a('string');
        str.should.match(/^[\w\-]{4,8} https?:\/\/(www\.)?google\.com\/search\?q=[\w+]*$/i);
        done();
      });

      google.search('win32', fn, ['random query']);
      setTimeout(() => done(new Error), 10);
    });
  });

});
