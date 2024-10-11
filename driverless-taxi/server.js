const express = require('express');
const AWS = require('aws-sdk');
const axios = require('axios'); // Import axios for making requests to Node-RED
const { GPSSensor, LidarSensor, CameraSensor, UltrasonicSensor, RadarSensor } = require('./sensors.js');
require('dotenv').config();

const app = express();
const port = 3000;

// AWS DynamoDB configuration
AWS.config.update({
    region: process.env.AWS_REGION,  // Ensure this is set correctly in .env (e.g., us-east-1)
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Initialize sensor classes
const gpsSensor = new GPSSensor();
const lidarSensor = new LidarSensor();
const cameraSensor = new CameraSensor();
const ultrasonicSensor = new UltrasonicSensor();
const radarSensor = new RadarSensor();

// Function to save data to DynamoDB
async function saveDataToDynamoDB(sensorType, data) {
    const params = {
        TableName: 'driverless-taxi2',  // Ensure this table exists and has 'id' as a Number
        Item: {
            id: data.id,               // Unique ID (Number)
            timestamp: data.timestamp, // ISO timestamp for data
            sensorType: sensorType,    // Identify the sensor type (GPS, Lidar, etc.)
            data: data                 // Store the actual sensor data
        }
    };

    try {
        await dynamoDB.put(params).promise();
        console.log(`${sensorType} data inserted successfully with ID: ${data.id}`);
    } catch (err) {
        console.error(`Error inserting ${sensorType} data:`, err);
    }
}

// Function to send data to Node-RED
async function sendDataToNodeRed(sensorType, data) {
    try {
        // Send data to Node-RED (adjust the URL according to your Node-RED setup)
        await axios.post('http://localhost:1880/sensor-data', {
            sensorType,
            data
        });
        console.log(`${sensorType} data sent to Node-RED`);
    } catch (error) {
        console.error(`Error sending ${sensorType} data to Node-RED:`, error);
    }
}

// Function to generate and save dummy sensor data
async function generateDummySensorData() {
    const timestamp = new Date().toISOString();
    const baseId = Date.now(); // Numeric timestamp

    try {
        // GPS data
        const gpsData = {
            id: baseId * 100 + 1,       // Unique Number ID
            timestamp: timestamp,
            ...gpsSensor.getLocation()  // Assumes getLocation returns an object
        };
        await saveDataToDynamoDB('GPS', gpsData);
        await sendDataToNodeRed('GPS', gpsData); // Send to Node-RED

        // LiDAR data
        const lidarData = {
            id: baseId * 100 + 2,        // Unique Number ID
            timestamp: timestamp,
            ...lidarSensor.getDistance() // Assumes getDistance returns an object
        };
        await saveDataToDynamoDB('Lidar', lidarData);
        await sendDataToNodeRed('Lidar', lidarData); // Send to Node-RED

        // Camera data
        const cameraData = {
            id: baseId * 100 + 3,        // Unique Number ID
            timestamp: timestamp,
            ...cameraSensor.captureImage() // Assumes captureImage returns an object
        };
        await saveDataToDynamoDB('Camera', cameraData);
        await sendDataToNodeRed('Camera', cameraData); // Send to Node-RED

        // Ultrasonic data
        const ultrasonicData = {
            id: baseId * 100 + 4,          // Unique Number ID
            timestamp: timestamp,
            ...ultrasonicSensor.getDistance() // Assumes getDistance returns an object
        };
        await saveDataToDynamoDB('Ultrasonic', ultrasonicData);
        await sendDataToNodeRed('Ultrasonic', ultrasonicData); // Send to Node-RED

        // Radar data
        const radarData = {
            id: baseId * 100 + 5,          // Unique Number ID
            timestamp: timestamp,
            ...radarSensor.getReading()    // Assumes getReading returns an object
        };
        await saveDataToDynamoDB('Radar', radarData);
        await sendDataToNodeRed('Radar', radarData); // Send to Node-RED

    } catch (err) {
        console.error("Error generating sensor data:", err);
    }
}

// Set interval to automatically generate and save sensor data every 5 seconds
setInterval(generateDummySensorData, 5000);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
