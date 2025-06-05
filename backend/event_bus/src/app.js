import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use("/event", async (req, res) => {
  const event = req.body;
  // User
  try {
    await axios.post(" https://smartfarm-user-mss-899314332d02.herokuapp.com/event", event);
  } catch (e) {
    console.log(e);
  }
  //Sensor
  try {
    await axios.post(" https://smartfarm-sensor-mss-60ba36d99b7f.herokuapp.com/event", event);
  } catch (e) {
    console.log(e);
  }
  //Leitura
  try {
    await axios.post("https://smartfarm-reading-mss-ee062958e049.herokuapp.com/event", event);
  } catch (e) {
    console.log(e);
  }
  //View
  try {
    await axios.post(" https://smartfarm-view-mss-753d9b4258f1.herokuapp.com/event", event);
  } catch (e) {
    console.log(e);
  }
  res.end();
});

export default app;
