import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User collection
        required: [true, 'Patient ID is required']
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the User collection
        required: [true, 'Doctor ID is required']
    },
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date and time are required']
    },
    reasonForVisit: {
        type: String,
        required: [true, 'Please state the reason for the visit'],
        trim: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-consultation', 'completed', 'canceled'],
        default: 'scheduled'
    },
    clinicalNotes: {
        type: String,
        default: '' // Filled out by the doctor during consultation
    }
}, {
    timestamps: true
});

export default mongoose.model('Appointment', AppointmentSchema);