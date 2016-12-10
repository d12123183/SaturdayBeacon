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
                var key = beacon.uuid + ':' + beacon.major + ':' + beacon.accuracy;
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
//var trilateparam=[];

        p1 = { x: 10, y: 10, z: 0, r: 0, major: 40851};
        p2 = { x: 5, y: 35, z: 0, r: 0, major: 54870};
        p3 = { x: 0, y: 5, z: 0, r: 0, major: 62910};

        //p4 = trilaterate(p1, p2, p3);



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

                p4 = trilaterate(p1, p2, p3);


    trilateparam1 = [p1.x,p1.y,p1.z,p1.r];
    trilateparam2 = [p2.x,p2.y,p2.z,p2.r];
    trilateparam3 = [p3.x,p3.y,p3.z,p3.r];
                p4 = trilaterate(trilateparam1, trilateparam2, trilateparam3);


                var element = $(
                    '<li>'

                    // +	'<strong>UUID: ' + beacon.uuid + '</strong><br />'
                    +	'Major: ' + beacon.major + '<br />'
                    //  +	'Minor: ' + beacon.minor + '<br />'
                    //  +	'Proximity: ' + beacon.proximity + '<br />'
                    +	'Distance: ' + beacon.accuracy + '<br />'

                    //+	'Beacon Radius p1: ' + p1.r + '<br />'
                    //+	'Beacon Radius p2: ' + p2.r + '<br />'
                    //+	'Beacon Radius p3: ' + p3.r + '<br />'

                    +	'Current Position: ' + console.log(p4) + '<br />'



                    //  +	'RSSI: ' + beacon.rssi + '<br />'
                    //+ 	'<div style="background:rgb(255,128,64);height:20px;width:'
                    //+ 		rssiWidth + '%;"></div>'
                    + '</li>'
                );

                $('#warning').remove();
                $('#found-beacons').append(element);


            }
        });
    }

    return app;
})();

app.initialize();
/**
 * Created by Brian on 10/12/2016.
 */
