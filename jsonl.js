const { chain } = require('stream-chain');

const { parser } = require('stream-csv-as-json');
const { asObjects } = require('stream-csv-as-json/AsObjects');
const { streamValues } = require('stream-json/streamers/StreamValues');

const fs = require('fs');
var saver = fs.createWriteStream('output.json', {
	flags: 'a', // 'a' means appending (old data will be preserved)
});
// var writeLine = (line) => saver.write(`\n${line}`);
saver.write('[');
const pipeline = chain([
	fs.createReadStream('address.csv'),
	parser(),
	asObjects(),
	streamValues(),
	(data) => {
		const value = data.value;
		// console.log(value);
		return value;
		// return value && value.department === 'accounting' ? data : null;
	},
]);

let counter = 0;
pipeline.on('data', (data) => {
	saver.write(JSON.stringify(data));
	saver.write(',');
});
pipeline.on('data', () => ++counter);
pipeline.on('end', () => {
	saver.write(']');
	console.log(`The accounting department has ${counter} employees.`);
});
