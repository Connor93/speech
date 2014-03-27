var argv = require('optimist')
    .usage('Use voices from the operating system, to read and speak the contents of a file')    
    .demand('f')
    .alias('f', 'file')
    .describe('f', 'Load the contents of a file and speak them')    
    .argv;
var os = require('os');
var fs = require('fs');

var edge;
try {
    edge = require( 'edge' );  
}
catch( e ) {
    if ( e.code === 'MODULE_NOT_FOUND' ) {
        edge = null;        
    }
}

var say;
try {
    say = require( 'say' );  
}
catch( e ) {
    if ( e.code === 'MODULE_NOT_FOUND' ) {
        say = null;        
    }
}

process.stdin.resume();
process.stdin.setEncoding('utf8');

var file;
var file = fs.createReadStream(argv.file);		
switch(os.type()){
	default: //Default is going to have to be.. osx / Linux
		speak(file);
		break;
	case "Windows_NT":		
		windowsSpeak(file);
		break;	
}

function windowsSpeak(file){	
	if(edge == null){
		console.log("edge not found, you are most likely running a windows command on a non windows machine");		
		return;
	} 
	//-- Below from -->  http://www.techresx.com/programming/nodejs-edge-dotnet-speech-synthesizer/ --//		
	var csSpeech = edge.func('cs', function () {/*
		#r "C:\Program Files\Reference Assemblies\Microsoft\Framework\v3.0\System.Speech.dll"
		using System.Speech.Synthesis;
		async (input) => {
			SpeechSynthesizer reader = new SpeechSynthesizer();
			reader.SpeakAsync(input.ToString());
			return "Speech Played";
		}
	*/});
	//------------------------------------------------------End----------------------------------
	var string = "";
	file.on('data', function (buf) { string += buf.toString(); });
	file.on('end', function(){ 
		csSpeech(string, function(error, result) {
			if (error) throw error;
			console.log(result + "\r\n");
		});		
	});
}

function speak(file){

	if(say == null){
		console.log("say is not found, you are most likely trying to run a linux / mac command on a non linux/ mac machine");
		return;
	}
	var string = "";
	file.on('data', function (buf) { string += buf.toString(); });
	file.on('end', function(){ 
		//Alex is just a random name i chose, if it doesn't work.. Other names can be found .. https://github.com/marak/say.js/
		say.speak('Alex', string);
	});
}