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

// SECURITY NOTE: Render uses a reverse proxy (Load Balancer). 
// This line ensures our rate-limiters read the user's actual IP, not Render's internal IP.
app.set('trust proxy', 1);

// Array of allowed origins tracking local testing and production deployments
const allowedOrigins = [
  'http://localhost:5173', // Default Vite local development port
  'http://localhost:3000', // Alternative React port
  'https://clinical-management-system-theta.vercel.app/', // <-- Add your live Vercel frontend URL here!
];

// Configure CORS with allowed origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy layer'));
    }
  },
  credentials: true, // Allows cookie transmission or auth tokens headers cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Global Middlewares
app.use(helmet());
app.use(cors(corsOptions));
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
app.listen(PORT, '0.0.0.0', () => console.log(`Server running smoothly on port ${PORT}`));