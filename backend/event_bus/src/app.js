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
    await axios.post("http://user-mss:3000/event", event);
  } catch (e) {
    console.log(e);
  }
  //Sensor
  try {
    await axios.post("http://sensor-mss:3001/event", event);
  } catch (e) {
    console.log(e);
  }
  //Leitura
  try {
    await axios.post("http://reading-mss:3002/event", event);
  } catch (e) {
    console.log(e);
  }
  //View
  try {
    await axios.post("http://view-mss:3003/event", event);
  } catch (e) {
    console.log(e);
  }
  res.end();
});

export default app;
