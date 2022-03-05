const fs = require('fs');

let denominations_raw = fs.readFileSync('denomination.json');
let denominations = JSON.parse(denominations_raw);

let address_raw = fs.readFileSync('address.json');
let address = JSON.parse(address_raw);

let arrayToOuput = [];

for (const c of denominations) {
	console.log(c);
	let cleanedNumber = `${c.EntityNumber.replace(/\D/g, '')}`;
	let add = address.filter((x) => x.EntityNumber === c.EntityNumber);
	let addressesToAdd = [];

	for (const a of add) {
		let addressToAdd = {
			Box: `${a.Box}`,
			CountryFR: `${a.CountryFR}`,
			CountryNL: `${a.CountryNL}`,
			DateStrikingOff: `${a.DateStrikingOff}`,
			KBO: `${a.EntityNumber}`,
			KBOcleaned: cleanedNumber,
			ExtraAddressInfo: `${a.ExtraAddressInfo}`,
			HouseNumber: `${a.HouseNumber}`,
			MunicipalityFR: `${a.MunicipalityFR}`,
			MunicipalityNL: `${a.MunicipalityNL}`,
			StreetFR: `${a.StreetFR}`,
			StreetNL: `${a.StreetNL}`,
			TypeOfAddress: `${a.TypeOfAddress}`,
			Zipcode: `${a.Zipcode}`,
		};
		addressesToAdd.push(addressToAdd);
	}

	let toAdd = {
		id: cleanedNumber,
		KBO: `${c.EntityNumber}`,
		KBOcleaned: cleanedNumber,
		Name: `${c.Denomination}`,
		Language: `${c.Language}`,
		Address: addressesToAdd,
	};

	arrayToOuput.push(toAdd);
}

let data = JSON.stringify(arrayToOuput);
fs.writeFileSync('output.json', data);
