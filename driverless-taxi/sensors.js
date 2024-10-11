// sensors.js
class GPSSensor {
  getLocation() {
    return {
      latitude: (Math.random() * 180 - 90).toFixed(6),
      longitude: (Math.random() * 360 - 180).toFixed(6),
      altitude: (Math.random() * 1000).toFixed(2),
      timestamp: new Date().toISOString(),
    };
  }
}

class LidarSensor {
  getDistance() {
    return {
      distance: (Math.random() * 50).toFixed(2), // Random distance up to 50 meters
      timestamp: new Date().toISOString(),
    };
  }
}

class CameraSensor {
  captureImage() {
    return {
      image: "dummy_image_data", // Replace with actual image data if needed
      timestamp: new Date().toISOString(),
    };
  }
}

class UltrasonicSensor {
  getDistance() {
    return {
      distance: (Math.random() * 10).toFixed(2), // Random distance up to 10 meters
      timestamp: new Date().toISOString(),
    };
  }
}

class RadarSensor {
  getReading() {
    return {
      detection: {
        object: "vehicle",
        distance: (Math.random() * 100).toFixed(2), // Random distance up to 100 meters
        speed: (Math.random() * 120).toFixed(2), // Random speed up to 120 km/h
      },
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = {
  GPSSensor,
  LidarSensor,
  CameraSensor,
  UltrasonicSensor,
  RadarSensor,
};
