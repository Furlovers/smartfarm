const axios = require("axios");

const SENSOR_IDS = [
  "062a3ea9-e832-4923-9200-c6dab0a80242",
  "84ec7b9a-9bfd-4e2c-a1a9-420fe8301684",
];

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MTQxZDdlLWM4N2QtNGFmNC04ZjkwLTY0ZWFkZDMzYjgwMSIsImVtYWlsIjoiZmF6ZW5kYWJvc3NhdG9AZ21haWwuY29tIiwicm9sZSI6InVzZXItYmFzaWMiLCJpYXQiOjE3NDkyNTQzMjAsImV4cCI6MTc0OTI1NzkyMH0.YETBLgeSt80yGmZCWMe92zhjC_zm22oSc81QJBknnPo";

const API_URL =
  "https://smartfarm-reading-mss-ee062958e049.herokuapp.com/readings";
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
