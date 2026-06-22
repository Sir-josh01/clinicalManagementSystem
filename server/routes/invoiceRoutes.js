import express from 'express';
const router = express.Router();
import { createInvoice, getMyInvoices, updateInvoiceToPaid } from '../controllers/invoiceController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

// Base routes for creating and fetching invoices
router.post('/', protect, restrictTo('admin', 'doctor'), createInvoice);
router.get('/my-invoices', protect, restrictTo('patient'), getMyInvoices);

// Put route to settle payment status
router.put('/:id/pay', protect, restrictTo('admin'), updateInvoiceToPaid);

export default router;