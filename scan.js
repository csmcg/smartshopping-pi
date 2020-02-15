const _ = require('lodash')
const BeaconScanner = require('node-beacon-scanner');
const noble = require('@abandonware/noble');
const http = require('http');
const scanner = new BeaconScanner({'noble': noble});

const serverHostname = '192.168.1.120';
const serverPort = 3000;
const postPath = '/'

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
		uuid = ad['iBeacon']['uuid'];
		if (!(uniq_beacons.includes(uuid))) {
			uniq_beacons.push(uuid)
		}
	});
	
	// Get Moving Average filter
	// for each uniuqe uuid, get all the rssi's for advertisements
	// with that uuid, sum them
	//beacons_read = [];	
	beacons_read = {}
	uniq_beacons.forEach(uuid => {
		beacons_read[uuid] = null; 
		rssi_total = 0;
		rssi_cnt = 0;
		advertisements.forEach(ad => {
			if (ad['iBeacon']['uuid'] == uuid) {
				rssi_total += ad['rssi'];
				rssi_cnt += 1;
			}
		});
		rssi_moving_average = _.round(rssi_total / rssi_cnt, 2);
		beacons_read[uuid] = rssi_moving_average;
		//beacons_read.push(beacon);
	});
	console.log(JSON.stringify(beacons_read));
	// post the interval's mvg average
	post_rssis(beacons_read);

	advertisements = [];
};

function post_rssis(readings) {
	let options = {
		hostname:	serverHostname,
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
		req.write(readings);
		req.end();
	});
	
};

// start scanning for iBeacon advertisements
scanner.startScan().then(() => {
	console.log('Started scan');
}).catch(error => {
	console.log(error);
});
