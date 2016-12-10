var app = (function()
{
	// Application object.
	var app = {};

	// Specify your beacon 128bit UUIDs here.
	var regions =
	[
		// Estimote Beacon factory UUID.
		{uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D'},
	// Dialog Semiconductor.
	];

	// Background detection.
	var notificationID = 0;
	var inBackground = false;
	document.addEventListener('pause', function() { inBackground = true });
	document.addEventListener('resume', function() { inBackground = false });

	// Dictionary of beacons.
	var beacons = {};

	// Timer that displays list of beacons.
	var updateTimer = null;

	app.initialize = function()
	{
		document.addEventListener(
			'deviceready',
			function() { evothings.scriptsLoaded(onDeviceReady) },
			false);
	};

	function onDeviceReady()
	{
		// Specify a shortcut for the location manager holding the iBeacon functions.
		window.locationManager = cordova.plugins.locationManager;

		// Start tracking beacons!
		startScan();

		// Display refresh timer.
		updateTimer = setInterval(displayBeaconList, 500);
	}

	function startScan()
	{
		// The delegate object holds the iBeacon callback functions
		// specified below.
		var delegate = new locationManager.Delegate();

		// Called continuously when ranging beacons.
		delegate.didRangeBeaconsInRegion = function(pluginResult)
		{
			//console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
			for (var i in pluginResult.beacons)
			{
				// Insert beacon into table of found beacons.
				var beacon = pluginResult.beacons[i];
				beacon.timeStamp = Date.now();
				var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
				beacons[key] = beacon;
			}
		};

		// Called when starting to monitor a region.
		// (Not used in this example, included as a reference.)
		delegate.didStartMonitoringForRegion = function(pluginResult)
		{
			//console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
		};

		// Called when monitoring and the state of a region changes.
		// If we are in the background, a notification is shown.
		delegate.didDetermineStateForRegion = function(pluginResult)
		{
			if (inBackground)
			{
				// Show notification if a beacon is inside the region.
				// TODO: Add check for specific beacon(s) in your app.
				if (pluginResult.region.typeName == 'BeaconRegion' &&
					pluginResult.state == 'CLRegionStateInside')
				{
					cordova.plugins.notification.local.schedule(
						{
							id: ++notificationID,
							title: 'Beacon in range',
							text: 'iBeacon Scan detected a beacon, tap here to open app.'
						});
				}
			}
		};

		// Set the delegate object to use.
		locationManager.setDelegate(delegate);

		// Request permission from user to access location info.
		// This is needed on iOS 8.
		locationManager.requestAlwaysAuthorization();

		// Start monitoring and ranging beacons.
		for (var i in regions)
		{
			var beaconRegion = new locationManager.BeaconRegion(
				i + 1,
				regions[i].uuid);

			// Start ranging.
			locationManager.startRangingBeaconsInRegion(beaconRegion)
				.fail(console.error)
				.done();

			// Start monitoring.
			// (Not used in this example, included as a reference.)
			locationManager.startMonitoringForRegion(beaconRegion)
				.fail(console.error)
				.done();
		}
	}

	function displayBeaconList()
	{
		// Clear beacon list.
		$('#found-beacons').empty();

		var timeNow = Date.now();

        p1 = { x: 1, y: 6, z: 0, r: 1, major: 40851};
        p2 = { x: 5, y: 3, z: 0, r: 1, major: 54870};
        p3 = { x: 3, y: 4, z: 0, r: 1, major: 62910};




		// Update beacon list.
		$.each(beacons, function(key, beacon)
		{
			// Only show beacons that are updated during the last 60 seconds.
			if (beacon.timeStamp + 60000 > timeNow)
			{
				// Map the RSSI value to a width in percent for the indicator.
				var rssiWidth = 1; // Used when RSSI is zero or greater.
				if (beacon.rssi < -100) { rssiWidth = 100; }
				else if (beacon.rssi < 0) { rssiWidth = 100 + beacon.rssi; }

				// Create tag to display beacon data.


                if (p1.major == beacon.major) {
                    p1.r = beacon.accuracy;
                }
                else if (p2.major == beacon.major) {
                    p2.r = beacon.accuracy;
                }

                else if (p3.major == beacon.major) {
                    p3.r = beacon.accuracy;
                }

                /*trilateparam1 = [p1.x,p1.y,p1.r];
                trilateparam2 = [p2.x,p2.y,p2.r];
                trilateparam3 = [p3.x,p3.y,p3.r];*/

                //p4 = trilaterate(trilateparam1, trilateparam2, trilateparam3);


               var S = (Math.pow(p3.x, 2.) - Math.pow(p2.x, 2.) + Math.pow(p3.y, 2.) - Math.pow(p2.y, 2.) + Math.pow(p2.r, 2.) - Math.pow(p3.r, 2.)) / 2.0;
                 var T = (Math.pow(p1.x, 2.) - Math.pow(p2.x, 2.) + Math.pow(p1.y, 2.) - Math.pow(p2.y, 2.) + Math.pow(p2.r, 2.) - Math.pow(p1.r, 2.)) / 2.0 ;

                 var py = ((S * (p2.x - p3.x)) - (S * (p2.x - p1.x))) / (((p1.y - p2.y) * (p2.x - p3.x)) - ((p3.y - p2.y) * (p2.x - p1.x)));
                 var px = ((py * (p1.y -p2.y )) - T) / (p2.x - p1.x);


                var element = $(
                '<li id="xloc">'
                +px
                + '</li>'+'<li id="yloc">'
                +py
                + '</li>'


            );
                document.getElementById('curlocationx').innerHTML=px;
                document.getElementById('curlocationy').innerHTML=py;


                var map = L.map('map',{

                    crs: L.CRS.Simple,
                    minZoom: 0

                });

                var bounds = [[0,0], [200,200]];

                var image = L.imageOverlay('ditmap/DIT-FloorPlan.jpg', bounds).addTo(map);

                var yx = L.latLng;

                var xy = function(x, y) {
                    if (L.Util.isArray(x)) {    // When doing xy([x, y]);
                        return yx(x[1], x[0]);
                    }
                    return yx(y, x);  // When doing xy(x, y);
                };

                //Beacon xy
                var b1      = xy(1, 2);
                var b2      = xy(3, 5);
                var b3      = xy(px, py);
                //var x1 = document.getElementById('curlocationx').innerHTML;
                //var y1 = document.getElementById('curlocationy').innerHTML;
                // var b3      = xy(x1, y1);
                //    var b4     = xy(, document.getElementById('yloc').innerHTML);

                // Beacon Markers
                L.marker(b1).addTo(map).bindTooltip('Beacon 1');
                L.marker(b2).addTo(map).bindTooltip('Beacon 2');
                 L.marker(b3).addTo(map).bindTooltip('Beacon 3');
                //L.marker(b4).addTo(map).bindTooltip('Beacon 4');

                //L.grid().addTo(map);

                //var travel = L.polyline([b1, b2, b3, b4, b5]).addTo(map);

                map.fitBounds(bounds);
                map.setView([800, 200], 1);



                $('#warning').remove();
			//	$('#found-beacons').append(element);




			}
		});
	}

	return app;
})();

app.initialize();
