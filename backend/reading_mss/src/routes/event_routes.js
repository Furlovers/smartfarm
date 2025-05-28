import express from 'express';

const router = express.Router();

const functions = {
}

router.post('/', async (req, res) => {
  const event = req.body
  if(functions[event.type]){
    await functions[event.type](event.data)
  }
  res.end()  
});

export default router;
