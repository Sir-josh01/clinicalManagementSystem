import Invoice from '../models/invoices.js';

// @desc    Generate a new patient invoice
// @route   POST /api/invoices
// @access  Private (Admins or Doctors can trigger billing)
export const createInvoice = async (req, res) => {
    const { patient, appointment, items } = req.body;

    try {
        const invoice = await Invoice.create({
            patient,
            appointment,
            items
        });

        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Get all invoices for the logged-in patient
// @route   GET /api/invoices/my-invoices
// @access  Private (Patients viewing their own bills)
export const getMyInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ patient: req.user._id })
            .populate('appointment', 'appointmentDate reasonForVisit')
            .sort({ createdAt: -1 });

        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Update invoice status to paid (Simulating or validating a payment)
// @route   PUT /api/invoices/:id/pay
// @access  Private (Admin updates, or webhook updates)
export const updateInvoiceToPaid = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        invoice.paymentStatus = 'paid';
        invoice.paymentReference = req.body.paymentReference || 'CASH_OR_POS_DIRECT';
        
        const updatedInvoice = await invoice.save();
        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};