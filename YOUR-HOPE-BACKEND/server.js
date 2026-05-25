import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import resultRoutes from './routes/resultRoutes.js';

dotenv.config();

const app = express();

/* Middleware */
app.use(cors());
app.use(express.json());

/* Routes */
app.use('/api/auth', authRoutes);
app.use('/api/results', resultRoutes);

/* Test Route */
app.get('/', (req, res) => {
    res.send('YOUR HOPE Backend Running');
});

/* Start Server */
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});