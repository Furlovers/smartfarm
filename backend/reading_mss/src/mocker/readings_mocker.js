const axios = require("axios");

const SENSOR_IDS = [
  "7967cda2-08e3-4d1f-9447-b263b454d4f5",
  "24add7be-45e4-4fe8-b8dd-feb3710c7a6b",
];

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRkZjllZGRiLTA3NDMtNGZiYy1iZDRjLTU3MGRjY2RlY2YwOSIsImVtYWlsIjoiZmF6ZW5kYXZhbmRlY29AZ21haWwuY29tIiwicm9sZSI6InVzZXItYmFzaWMiLCJpYXQiOjE3NDkyNTQ5OTAsImV4cCI6MTc0OTI1ODU5MH0.K0DFbVvWjL6WQ7GZ_GZ6zTOzY9wsoDhwh21pDYqrujg";

const API_URL = "http://localhost:3002/readings";
const NUM_READINGS = 20;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function getRandomInRange(min, max, decimals = 0) {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
}

async function populateReadings() {
  const now = Date.now();

  for (let i = 0; i < NUM_READINGS; i++) {
    const sensorId = SENSOR_IDS[i % SENSOR_IDS.length];
    const createdAt = now - (NUM_READINGS - i - 1) * ONE_DAY_MS;

    const data = {
      battery: getRandomInRange(50, 100),
      temperature: getRandomInRange(20, 30, 1),
      humidity: getRandomInRange(20, 90, 1),
      pH: getRandomInRange(5.5, 8.5, 2),
      luminosity: getRandomInRange(30, 100),
      sensorId,
      createdAt,
    };

    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      });
      console.log(
        `Inserido para ${sensorId} em ${new Date(createdAt).toISOString()}`
      );
    } catch (error) {
      console.error(`Erro ao inserir: ${JSON.stringify(data)}`);
      console.error(error.response?.data || error.message);
    }
  }
}

populateReadings();
