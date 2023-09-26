let osc = require("osc");

/*******************
 * CLI Parameters: 
 	incoming-osc port
 	outgoing-osc-port *
 *******************/
 
let inPort = 0;
let outPort = 0;
let oscnamespace = "";

if (process.argv.length !== 5) {
	console.error('Expect three parameters i.e. node index.js 8000 8001 /OSC/NAMESPACE');
	process.exit(1);
} else {
	inPort = process.argv[2];
	outPort = process.argv[3];
	oscnamespace = process.argv[4];
	console.log("Corrected: " + oscnamespace);
}

/*******************
 * OSC Over Serial *
 *******************/

// // Instantiate a new OSC Serial Port.
// var serialPort = new osc.SerialPort({
//     devicePath: process.argv[2] || "/dev/tty.usbmodem221361"
// });
// 
// serialPort.on("message", function (oscMessage) {
//     console.log(oscMessage);
// });
// 
// // Open the port.
// serialPort.open();


/****************
 * OSC Over UDP *
 ****************/
 
var getIPAddresses = function () {
    var os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (var deviceName in interfaces) {
        var addresses = interfaces[deviceName];
        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};


var udpServer = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: inPort
});


udpServer.on("ready", function () {
    var ipAddresses = getIPAddresses();

    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpServer.options.localPort);
    });
});


udpServer.on("message", function (oscMessage) {

	// Android Phone OSC MESSAGE FORMAT /eo/touch0
	if(oscMessage.address === oscnamespace) {
		for (let i = 0; i < oscMessage.args.length; i++) { 
		 
			let _t = parseFloat(oscMessage.args[i]); // toPrecision(5)
			oscMessage.args[i] = _t;
		}
	}
	
	console.log("ROUTED OSC MESSAGE: ");
	console.log(oscMessage);
	
    udpServer.send({
    	address: oscMessage.address,
        args: oscMessage.args
	}, "127.0.0.1", outPort);
});


udpServer.on("error", function (err) {
    console.log(err);
});


udpServer.open();