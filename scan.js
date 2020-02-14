const _ = require('lodash')
const BeaconScanner = require('node-beacon-scanner');
const noble = require('@abandonware/noble');
const http = require('http');
const scanner = new BeaconScanner({'noble': noble});

let advertisements = []; // beacons

const scanInterval = 2; // seconds

const collectBeacon = (ad) => {
};

// received an advertisement packet
scanner.onadvertisement = ad => {
	//console.log(JSON.stringify(ad, null, ' ')); // log to console
	advertisements.push(ad); // add to advertisements collection
};

let interval = setInterval(collectRSSIs, scanInterval * 1000);

// called every interval:
//		- separate out unique beacons
//		- for each unique beacon, get all rssi's received
//		- average rssi's for each beacon
//		- empty advertisements[]
function collectRSSIs() {
	// shoud return list of UUIDs
	uniq_beacons = _.find(_.countBy(advertisements, (advertisements) => {return advertisements.iBeacon.uuid})); 
	console.log(uniq_beacons);
	beacons = _.filter(advertisements, () => {
	});
};


// start scanning for iBeacon advertisements
scanner.startScan().then(() => {
	console.log('Started scan');
}).catch(error => {
	console.log(error);
});