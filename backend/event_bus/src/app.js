import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/event', async (req, res) => {
  const event = req.body
  try{
    await axios.post('http://localhost:3000/event', event)
  }
  catch(e){
    console.log(e)
  }
  try {
    await axios.post('http://localhost:3001/event', event)
  } catch (e) {
    console.log(e)
  }
  try{
    await axios.post('http://localhost:3002/event', event)
  }
  catch(e){
    console.log(e)
  }
  res.end()
})

export default app;
