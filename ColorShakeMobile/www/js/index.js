/*
 * index.js
 */

"use strict";

var permissionButton;       // Button to request shake detection permission
var colorButton;            // Button to manually change the color
var rgbLabel;               // Label to display the current RGB color
var shakeLabel;             // Label to display shake status

/* wait until all cordova is loaded then call initialize */
document.addEventListener("deviceready", initialize, false);

// on startup, get elements, get permission to watch for shakes
function initialize() {
    // Get UI elements by their IDs
    permissionButton = document.getElementById('permissionButtonId');
    colorButton = document.getElementById('colorButtonId');
    rgbLabel = document.getElementById('rgbLabelId');
    shakeLabel = document.getElementById('shakeLabelId');

    // Add event listeners to buttons
    permissionButton.addEventListener('click', requestPermission, false);
    colorButton.addEventListener('click', changeColor, false);

    // Initially disable the color button until permissions are granted
    colorButton.disabled = true;

    console.log("App initialized and waiting for user actions.");
}

// ask for user permissions to sense device shakes
function requestPermission() {
    console.log("Requesting shake detection permission...");
    if (typeof shake.requestPermission === "function") {
        // Request permission for newer Android/iOS versions
        shake.requestPermission(function (granted) {
            if (granted) {
                console.log("Shake detection permission granted.");
                startShakeDetection();
            } else {
                console.log("Shake detection permission denied.");
                alert("Shake detection permission was denied.");
            }
        });
    } else {
        // For older versions or platforms that don't require explicit permission
        console.log("Permission not required for shake detection.");
        startShakeDetection();
    }
}

// Check result of the permission request and start shake detection
function startShakeDetection() {
    // Hide the permission button and enable color change button
    permissionButton.style.visibility = 'hidden';
    colorButton.disabled = false;
    shakeLabel.innerHTML = "or shake me!";

    // Start detecting shakes with sensitivity
    shake.startWatch(onShake, 10);
    console.log("Shake detection started.");
}

// what to do when shake is detected
function onShake() {
    console.log("Shake detected!");
    changeBackgroundColor();
}

// Generate a random RGB color and apply it
function changeBackgroundColor() {
    // Generate a random RGB color
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    // Change the background color
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    // Update the RGB label
    rgbLabel.innerHTML = `RGB: (${r}, ${g}, ${b})`;
    console.log(`Background color changed to RGB(${r}, ${g}, ${b}).`);
}

// put your functions to modify the background color and label here
function changeColor() {
    console.log("Change color button clicked!");
    changeBackgroundColor();
}

// what to do if there is an error (nothing really, so just alert)
function onShakeError(error) {
    console.error("An error occurred during shake detection:", error);
    alert("An error occurred while detecting a shake.");
}
