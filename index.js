#!/usr/local/bin/node

const un = require('./unlo.js');
const rl = require('readline').createInterface(process.stdin, process.stdout);

var args = process.argv.slice(2);

if(!args[0]) {		//app started without arguments at command line
	showMenu();
}

//TODO start app with arguments, e.g. --info or --version or whatever

function showMenu()   {

	process.stdout.write('\033c');			//clear screen

	console.log('\n');
	console.log('\t\tUNLOCODE');
	console.log('\t\t--------\n')
	console.log('\t1 - Get Port and Country by code');
	console.log('\t2 - Find Countryname by ID');
	console.log('\t3 - Get the name of a country');
	console.log('\t4 - Get port(s) by ID');
	console.log('\t5 - Get port(s) by name');
	console.log('\n');

	showPrompt();
}

rl.on('line', function(input) {
	if(input == 'exit' || input === 'q') process.exit(0);

	if(input === 'cls') showMenu();

	switch(input) {
		case '1':
			getByUnlocode();
		break;

		case '2':
			getCountryById();
		break;

		case '3':
			getCountryByName();
		break;

		case '4':
			getPortById();
		break;

		case '5':
			getPortByName();
		break;

		default:
			console.log(warningRed('"' + input + '"is not valid, try again\n'));
			showPrompt();
		break;
	}
})

//Option 1
function getByUnlocode() {
	rl.question(prompt_opt_one, function(x) {
 		checkExit(x)
 			? showPrompt()
 			: x.length == 5
 				? findByUnloCode(x)
 				: notValid(error_unlocode, getByUnlocode)
 	});
}

//Option 2
function getCountryById() {
		rl.question(prompt_opt_two, function(x) {
 		checkExit(x)
 			? showPrompt()
 			: x.length == 2
 				? findCountryById(x)
 				: notValid(error_countryid, getCountryById)
 	});
}

//Option 3
function getCountryByName() {
	rl.question(prompt_opt_three, function(x) {
		checkExit(x)
			? showPrompt()
			: findCountryByName(x);
	})
}

//Option 4
function getPortById() {
	rl.question(prompt_opt_four, function(x) {
		checkExit(x)
			? showPrompt()
			: x.length === 3
				? findPortById(x)
				: notValid(error_portid, getPortById)
	})
}

//Option 5
function getPortByName() {
	rl.question(prompt_opt_five, function(x) {
		checkExit(x)
			? showPrompt()
			: findPortByName(x)
	})
}

function findByUnloCode(code) {

		var _countryId = code.substr(0,2);
		var _portId = code.substr(2,3);

		var _name = un.getByUnloCode(_countryId, _portId);

		if(!_name.country && ! _name.port) _name.country =  _name.port = 'not exist';
		if(_name.country && !_name.port) _name.port = 'not exist in ' + _name.country;

		console.log('\n'
			+ '\t' + _countryId.toUpperCase() + '  => ' + _name.country.toUpperCase()
			+ '\n'
			+ '\t' + _portId.toUpperCase() + ' => ' + _name.port.toUpperCase());

		showPrompt();
}

function findCountryById(Id) {

	var _name = un.getCountryById(Id);
	if(!_name) _name = 'not exist';

	console.log('\n'
		+ '\t'
		+ Id.toUpperCase()
		+ ' => '
		+ _name.toUpperCase());

		showPrompt();
}

function findCountryByName(name) {

		var _name = un.getCountryByName(name);

		if(_name.length != 0) {
			console.log('\n');
			_name.forEach(function(_country) {
				console.log('\t'
					+ _country.countryid.toUpperCase() + ' => ' + _country.countryname.toUpperCase());
				});
			showPrompt();
		}
		else notValid(warningRed('Did not find a country "' + name.toUpperCase() + ' try again\n'), getCountryByName);
}

function findPortById(Id) {

	var _name = un.getPortById(Id);

		if(_name.length != 0) {
			console.log('\n');
			_name.forEach(function(_port) {
				console.log('\t' + _port.countryid + Id.toUpperCase()
					+ ' => '
					+ _port.port.toUpperCase() + ' ,' + un.getCountryById(_port.countryid));
				});
			showPrompt();
		}
		else notValid(warningRed('Did not find a port "' + Id.toUpperCase() + '" try again\n'), getPortById);
}

function findPortByName(name) {

	var _name = un.getPortByName(name);
	if(_name.length != 0) {
			console.log('\n');
			_name.forEach(function(_port) {
				console.log('\t' + _port.countryid + _port.portid
					+ ' => '
					+ _port.portname.toUpperCase()
					+ ' ,'
					+ un.getCountryById(_port.countryid)
					);
			});
		showPrompt();
	}
	else notValid(warningRed('Did not find a port with name "' + name.toUpperCase() + '" try again\n'), getPortByName)
}

function showPrompt(title) {
	title = title || 'MENU> ';
	rl.setPrompt(title);
	rl.prompt();
}

function checkExit(x) {
	return x === 'exit' || x ==='q' ? true  : false;
}

function notValid(msg, callback) {
	console.log(msg);
	callback();
}

//Catch ^C
rl.on('close', function() {
	console.log('..to close, exit or q');
	process.exit(0);
})

function warningRed(text) {
    const color_RED = '\033[31m';
    const color_RESET = '\033[39m';

    return color_RED + text + color_RESET;
}

const prompt_opt_one = 'Enter port and country code : ';
const prompt_opt_two = 'Enter two character ID : ';
const prompt_opt_three = 'Enter (part of) country name : ';
const prompt_opt_four = 'Enter 3 character ID : ';
const prompt_opt_five = 'Enter (part of) port name : ';

const error_unlocode = warningRed('UNLOCODE is 5 characters, try again\n');
const error_countryname = '';
const error_countryid = warningRed( 'Country ID is 2 characters, try again\n');
const error_portname = '';
const error_portid = warningRed('Port ID is 3 characters, try again\n');

