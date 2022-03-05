const { chain } = require('stream-chain');

const { parser } = require('stream-csv-as-json');
const { asObjects } = require('stream-csv-as-json/AsObjects');
const { streamValues } = require('stream-json/streamers/StreamValues');

const fs = require('fs');
var saver = fs.createWriteStream('ad_id.jsonl', {
	flags: 'a', // 'a' means appending (old data will be preserved)
});
var writeLine = (line) => saver.write(`\n${line}`);
// saver.write('[');
const pipeline = chain([
	fs.createReadStream('address.csv'),
	parser(),
	asObjects(),
	streamValues(),
	(data) => {
		const a = data.value;
		let cleanedNumber = `${a.EntityNumber.replace(/\D/g, '')}`;
		let addressToAdd = {
			id: cleanedNumber,
			Box: `${a.Box}`,
			CountryFR: `${a.CountryFR}`,
			CountryNL: `${a.CountryNL}`,
			DateStrikingOff: `${a.DateStrikingOff}`,
			ExtraAddressInfo: `${a.ExtraAddressInfo}`,
			HouseNumber: `${a.HouseNumber}`,
			MunicipalityFR: `${a.MunicipalityFR}`,
			MunicipalityNL: `${a.MunicipalityNL}`,
			StreetFR: `${a.StreetFR}`,
			StreetNL: `${a.StreetNL}`,
			TypeOfAddress: `${a.TypeOfAddress}`,
			Zipcode: `${a.Zipcode}`,
		};
		return addressToAdd;
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
