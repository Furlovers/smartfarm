const axios = require("axios");

const SENSOR_IDS = [
  "7f22e8c9-43f9-4019-a02e-491cfa007e6a",
  "9e3659d2-310c-4402-810a-7d04ffb9da6b",
];

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5NmZmMzZhLWY3ZmYtNGVlMy05ZjJmLThiMWE3MDVkYzdmYiIsImVtYWlsIjoiYWRtaW5AbWFpbC5jb20iLCJyb2xlIjoidXNlci1iYXNpYyIsImlhdCI6MTc0ODY5Mjc4NywiZXhwIjoxNzQ4Njk2Mzg3fQ.nufFS63sKTIiaONW9LwGTFJE8TqsRs8ujS2umZitfbY";

const API_URL = "https://smartfarm-reading-mss-ee062958e049.herokuapp.com/readings";
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
      battery: getRandomInRange(10, 100),
      temperature: getRandomInRange(10, 45, 1),
      humidity: getRandomInRange(20, 90, 1),
      pH: getRandomInRange(5.5, 8.5, 2),
      luminosity: getRandomInRange(100, 1000),
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
        `✅ Inserido para ${sensorId} em ${new Date(createdAt).toISOString()}`
      );
    } catch (error) {
      console.error(`❌ Erro ao inserir: ${JSON.stringify(data)}`);
      console.error(error.response?.data || error.message);
    }
  }
}

populateReadings();
