require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/tasks', tasksRouter);
app.use(cors({ origin: "http://localhost:3000" }));


app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
