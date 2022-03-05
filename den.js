const { chain } = require('stream-chain');

const { parser } = require('stream-csv-as-json');
const { asObjects } = require('stream-csv-as-json/AsObjects');
const { streamValues } = require('stream-json/streamers/StreamValues');

const fs = require('fs');
var saver = fs.createWriteStream('deno_id.jsonl', {
	flags: 'a', // 'a' means appending (old data will be preserved)
});
var writeLine = (line) => saver.write(`\n${line}`);
// saver.write('[');
const pipeline = chain([
	fs.createReadStream('denomination.csv'),
	parser(),
	asObjects(),
	streamValues(),
	(data) => {
		const value = data.value;
		let cleanedNumber = `${value.EntityNumber.replace(/\D/g, '')}`;
		let toAdd = {
			id: cleanedNumber,
			KBO: `${value.EntityNumber}`,
			KBOcleaned: cleanedNumber,
			Name: `${value.Denomination}`,
			Language: `${value.Language}`,
			Address: [],
		};
		return toAdd;
		// return value && value.department === 'accounting' ? data : null;
	},
]);

let counter = 0;
pipeline.on('data', (data) => {
	writeLine(JSON.stringify(data));
	// saver.write(',');
});
pipeline.on('data', () => ++counter);
pipeline.on('end', () => {
	// saver.write(']');
	console.log(`The accounting department has ${counter} employees.`);
});
