import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  const event = req.body
  await functions[event.type](event.data)
  res.end()  
});

export default router;
