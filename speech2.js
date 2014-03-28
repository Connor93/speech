// parser.js
var Transform = require('stream').Transform;

var parser = new Transform();
parser._transform = function(data, encoding, done) {
  this.push(data);
  done();
};

// Pipe the streams
process.stdin
.pipe(parser)
.pipe(process.stdout);

// Some programs like `head` send an error on stdout
// when they don't want any more data
process.stdout.on('error', process.exit);