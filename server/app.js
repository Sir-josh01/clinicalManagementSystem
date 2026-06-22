import express, { json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import connectDB from './config/database.js'; // Import database connector
import appointmentRoutes from './routes/appointmentRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Import authentication routes
import recordRoutes from './routes/recordRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';



// Load environment variables
config();

// Connect to Database
connectDB();

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json()); 

// Base Test Route
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the Clinical Management System API" });
});

// Route Middleware - Map API endpoints to route handlers
app.use('/api/auth', authRoutes); // Routes for user registration and login
app.use('/api/appointments', appointmentRoutes); // Routes for managing appointments
app.use('/api/records', recordRoutes); // Routes for managing medical records
app.use('/api/invoices', invoiceRoutes); // Routes for managing invoices


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running smoothly on port ${PORT}`));