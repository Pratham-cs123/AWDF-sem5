const app = require('./app');
const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Practical 12 Server running on http://localhost:${PORT}`);
});
