import app from './app.js';

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Event Bus Running on port ${PORT}...`);
});