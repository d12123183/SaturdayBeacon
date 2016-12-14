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

        p1 = { x: 1, y: 1, z: 0, r: 1, major: 40851};
        p2 = { x: 3, y: 1, z: 0, r: 1, major: 54870};
        p3 = { x: 1, y: 5, z: 0, r: 1, major: 62910};

    /*    p1 = { x: 393, y: 780, z: 0, r: 1, major: 40851};
        p2 = { x: 389, y: 755, z: 0, r: 1, major: 54870};
        p3 = { x: 292, y: 734, z: 0, r: 1, major: 62910};*/

        /*p1 = { x: 356, y: 711, z: 0, r: 1, major: 40851};
        p2 = { x: 393, y: 708, z: 0, r: 1, major: 54870};
        p3 = { x: 402, y: 764, z: 0, r: 1, major: 62910};*/

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

/*
               var S = (Math.pow(p3.x, 2.) - Math.pow(p2.x, 2.) + Math.pow(p3.y, 2.) - Math.pow(p2.y, 2.) + Math.pow(p2.r, 2.) - Math.pow(p3.r, 2.)) / 2.0;
                 var T = (Math.pow(p1.x, 2.) - Math.pow(p2.x, 2.) + Math.pow(p1.y, 2.) - Math.pow(p2.y, 2.) + Math.pow(p2.r, 2.) - Math.pow(p1.r, 2.)) / 2.0 ;

                 var py = ((S * (p2.x - p3.x)) - (S * (p2.x - p1.x))) / (((p1.y - p2.y) * (p2.x - p3.x)) - ((p3.y - p2.y) * (p2.x - p1.x)));
                 var px = ((py * (p1.y -p2.y )) - T) / (p2.x - p1.x);*/


// second trilateration

                /*p1 = { x: 393, y: 780, z: 0, r: 20, major: 40851};
                p2 = { x: 389, y: 755, z: 0, r: 10, major: 54870};
                p3 = { x: 292, y: 734, z: 0, r: 14, major: 62910};*/

                //p1 = { x: 393, y: 780, r: 5};
                //p2 = { x: 389, y: 755, r: 6};
                //p3 = { x: 292, y: 734, r: 3};


                var xa = p1.x;
                var ya = p1.y;
                var xb = p2.x;
                var yb = p2.y;
                var xc = p3.x;
                var yc = p3.y;
                var ra = p1.r;
                var rb = p2.r;
                var rc = p3.r;

                var S = (Math.pow(xc, 2.) - Math.pow(xb, 2.) + Math.pow(yc, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(rc, 2.)) / 2.0;
                var T = (Math.pow(xa, 2.) - Math.pow(xb, 2.) + Math.pow(ya, 2.) - Math.pow(yb, 2.) + Math.pow(rb, 2.) - Math.pow(ra, 2.)) / 2.0;
                var py = ((T * (xb - xc)) - (S * (xb - xa))) / (((ya - yb) * (xb - xc)) - ((yc - yb) * (xb - xa)));
                var px = ((py * (ya - yb)) - T) / (xb - xa);



                var element = $(
                '<li id="xloc">'
                +px
                + '</li>'+'<li id="yloc">'
                +py
                + '</li>'
            );



                function errorCB(err) {
                    alert("Error processing SQL: "+err.code);
                    document.getElementById('dbtest').innerHTML='error in db';
                }

                // Transaction success callback
                //
                function successCB() {

                    document.getElementById('dbtest').innerHTML='success in db';
                }

                // Cordova is ready
                //

                    //db.transaction(searchQueryDB, errorCB);
                    //db.transaction(querySuccess, errorCB);

                function searchQueryDB(tx) {

                  //  tx.executeSql('select * from nodes ',[], querySuccess, errorCB);
                    tx.executeSql('select * from nodes where '+ px + ' <=upper_x and ' +py + '<=upper_y and '+ px + ' >=lower_x and ' +py + '>=lower_y',[], querySuccess, errorCB);
                        //'where '+ px + ' <= upper_x AND '+ px + ' >= lower_x AND' +py + '<=upper_y AND '+ px + '>= lower_y',

                }

              function querySuccess(tx, results) {
                    var len = results.rows.length;
                    document.getElementById('dbtest').innerHTML='test in db'+len;
                    for (var i = 0; i < len; i++) {
                        document.getElementById('dbtest').innerHTML='found something';
                        var tmpArgs=results.rows.item(i).node_location;
                        document.getElementById('dbtest').innerHTML='LOCATION :x:'+px+' y:'+py+ ' AREA: '+tmpArgs;
                    }
                     //document.getElementById('dbtest').innerHTML='test in db'+len;
                }

                function errorCB(err) {
                    //alert("Error processing SQL: "+err.code);
                    var a=10;

                }

                // Transaction success callback
                //
                function successCB() {

                                  document.getElementById('dbtest').innerHTML='success in db';
                }

                // Cordova is ready
                //

                var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);

                db.transaction(searchQueryDB, errorCB);
                db.transaction(querySuccess, errorCB);

                //document.getElementById('curlocationx').innerHTML=px;
                //document.getElementById('curlocationy').innerHTML=py;


                var map = L.map('map',{

                    crs: L.CRS.Simple,
                    minZoom: 0

                });

                var bounds = [[0,0], [1000,1000]];

                var image = L.imageOverlay('ditmap/DIT-FloorPlan.jpg', bounds).addTo(map);

                var yx = L.latLng;

                var xy = function(x, y) {
                    if (L.Util.isArray(x)) {    // When doing xy([x, y]);
                        return yx(x[1], x[0]);
                    }
                    return yx(y, x);  // When doing xy(x, y);
                };

                //Beacon static xy
                var beacon1     = xy(p1.x, p1.y);
                var beacon2     = xy(p2.x, p2.y);
				var beacon3 	= xy(p3.x, p3.y);

				// trilaterate x y result
                var current_location = xy(px, py);

                //var x1 = document.getElementById('curlocationx').innerHTML;
                //var y1 = document.getElementById('curlocationy').innerHTML;
                // var b3	= xy(x1, y1);
                // var b4   = xy(, document.getElementById('yloc').innerHTML);


                // Beacon Markers
               	L.marker(beacon1).addTo(map).bindTooltip('Beacon 1');
               	L.marker(beacon2).addTo(map).bindTooltip('Beacon 2');
                L.marker(beacon3).addTo(map).bindTooltip('Beacon 3');
				L.marker(current_location).addTo(map).bindTooltip('Your Location');
                //L.marker(b4).addTo(map).bindTooltip('Beacon 4');

                //L.grid().addTo(map);

                //var travel = L.polyline([b1, b2, b3, b4, b5]).addTo(map);

                map.fitBounds(bounds);
                map.setView([500, 200], 1);

                $('#warning').remove();
			//	$('#found-beacons').append(element);

			}
		});
	}

	return app;
})();

app.initialize();
