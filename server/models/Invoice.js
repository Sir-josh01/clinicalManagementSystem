import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Patient reference is required']
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: [true, 'Appointment reference is required']
    },
    items: [
        {
            description: { type: String, required: true }, // e.g., "Consultation Fee", "Amoxicillin 500mg"
            cost: { type: Number, required: true }         // e.g., 5000, 2500
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    paymentReference: {
        type: String, // Will hold transaction reference IDs from Paystack/Stripe
        default: ''
    }
}, {
    timestamps: true
});

// Pre-save Middleware: Automatically calculate the total amount from the itemized costs
InvoiceSchema.pre('save', function(next) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.cost, 0);
    next();
});

export default mongoose.model('Invoice', InvoiceSchema);