// do not edit this file

// Lee Crossley write a cordova plugin to detect phone shakes using the 
// accelerameter chip and published an API to use it.
//
// https://github.com/leecrossley/cordova-plugin-shake
// Shake Gesture Detection for Cordova npm version
// Apache Cordova / PhoneGap Plugin to detect when a physical device performs a 
// shake gesture.
//
// After iOS 13+ changed permission model, his plugin no longer works
// however, we have carefully recreated the interface
// Students do not need to understand how this works, just how to use it.


// Define a global object to hold our shake API
var shake = (function() {
    // Function to call when a shake is detected
    var onShakeCallback = null;
    var onErrorCallback = null;
    var watchId = null;
    var shakeThreshold = 10; // default shake sensitivity

    // Variable to hold the last and current acceleration values
    var lastAcceleration = { x: null, y: null, z: null };

    // Function to handle the motion event
    function handleMotionEvent(event) {
        var currentAcceleration = event.accelerationIncludingGravity;

        if (lastAcceleration.x !== null) {
            var deltaX = Math.abs(lastAcceleration.x - currentAcceleration.x);
            var deltaY = Math.abs(lastAcceleration.y - currentAcceleration.y);
            var deltaZ = Math.abs(lastAcceleration.z - currentAcceleration.z);

            // Compare the differences with the threshold
            if ((deltaX > shakeThreshold && deltaY > shakeThreshold) || 
                (deltaX > shakeThreshold && deltaZ > shakeThreshold) || 
                (deltaY > shakeThreshold && deltaZ > shakeThreshold)) {
                if(onShakeCallback) onShakeCallback(); // Call the onShake callback
            }
        }

        // Update the last acceleration values
        lastAcceleration = {
            x: currentAcceleration.x,
            y: currentAcceleration.y,
            z: currentAcceleration.z
        };
    }

    // Start watching for shake events
    function startWatch(onShake, sensitivity, onError) {
        onShakeCallback = onShake || null;
        onErrorCallback = onError || null;
        if(sensitivity) shakeThreshold = sensitivity;

        // Request permission for iOS 13+ devices
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') {
                    watchId = window.addEventListener('devicemotion', handleMotionEvent, true);
                } else {
                    if(onErrorCallback) onErrorCallback();
                }
            }).catch(error => {
                if(onErrorCallback) onErrorCallback(error);
            });
        } else {
            // Non-iOS 13+ devices
            watchId = window.addEventListener('devicemotion', handleMotionEvent, true);
        }
    }

    // Stop watching for shake events
    function stopWatch() {
        if (watchId !== null) {
            window.removeEventListener('devicemotion', handleMotionEvent, true);
            watchId = null;
        }
        lastAcceleration = { x: null, y: null, z: null }; // Reset last acceleration
    }

    // This method handles the permission request that needs user interaction on iOS
    function requestPermission(callback) {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission().then(permissionState => {
                if (permissionState === 'granted') {
                    callback(true);
                } else {
                    callback(false);
                }
            }).catch(console.error);
        } else {
            // Automatically grant permission for non-iOS 13+ devices as they do not require it
            callback(true);
        }
    }
    
    // Return the public API
    return {
        startWatch: startWatch,
        stopWatch: stopWatch,
        requestPermission: requestPermission // add this line to expose it
    };
})();

// Example usage:
// shake.startWatch(function() {
//     alert('Shake detected!');
// }, 30);
