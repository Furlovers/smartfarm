const axios = require("axios");

const SENSOR_IDS = [
  "482c1499-6fe3-4ed4-950c-e0433eb66318",
  "3725cef6-a625-4a7b-95ab-01c7f2fc6892",
];

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUyMDg0YjY2LWM2OTQtNDQxNC05Nzg4LWY3NjQ4NGVkZjdkZSIsImVtYWlsIjoiZmF6ZW5kYWVwQGVtYWlsLmNvbSIsInJvbGUiOiJ1c2VyLWJhc2ljIiwiaWF0IjoxNzYyMjA1ODc0LCJleHAiOjE3NjIyMDk0NzR9.LNj8BmG8HiV5ZH86Z0s6jQuo-8N1REzfZcUYOO6Aud4";

const API_URL = "http://localhost:31002/readings";
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
