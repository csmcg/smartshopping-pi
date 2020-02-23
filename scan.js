const _ = require('lodash')
const BeaconScanner = require('node-beacon-scanner');
const noble = require('@abandonware/noble');
const http = require('http');
const scanner = new BeaconScanner({'noble': noble});

const serverHost = '10.42.0.1';
const serverPort = 3000;
const postPath = '/'

// beacon parameters
const MAJOR_ID = 999;

let advertisements = []; // beacons
const scanInterval = 2; // seconds

// received an advertisement packet
scanner.onadvertisement = ad => {
	advertisements.push(ad); // add to advertisements collection
};

let interval = setInterval(collectRSSIs, scanInterval * 1000);

function collectRSSIs() {
	uniq_beacons = [];
	advertisements.forEach(ad => {
		minor_id = ad['iBeacon']['minor'];
		if (!(uniq_beacons.includes(minor_id))) {
			uniq_beacons.push(minor_id)
		}
	});
	
	// Get Moving Average filter
	// for each uniuqe minor id, get all the rssi's for advertisements
	// with that minor id, sum them
	beacons_read = {} // JSON object, where each key is a minor id, and value is that beacon's 
					  // moving average rssi for the scanning interval
	uniq_beacons.forEach(minor => {

		beacons_read[minor] = null; 
		rssi_total = 0;
		rssi_cnt = 0;
		advertisements.forEach(ad => {
			if (ad['iBeacon']['minor'] == minor) {
				rssi_total += ad['rssi'];
				rssi_cnt += 1;
			}
		});
		rssi_moving_average = _.round(rssi_total / rssi_cnt, 2);
		beacons_read[minor] = rssi_moving_average;
	});
	console.log(JSON.stringify(beacons_read));
	// post the interval's mvg average
	post_rssis(beacons_read);

	advertisements = [];
};

function post_rssis(readings) {
	let options = {
		host:		serverHost,
		port:		serverPort,
		path:		postPath,
		method:		'POST',
		headers:	{
			'Content-Type':		'application/json'//,
			//'Content-Length':	readings.length 
		}
	};
	const req = http.request(options, (res) => {
		console.log(`Response Status Code: ${res.statusCode}`);
	});
	req.write(JSON.stringify(readings));
	req.end();
};

// start scanning for iBeacon advertisements
scanner.startScan().then(() => {
	console.log('Started scan');
}).catch(error => {
	console.log(error);
});
