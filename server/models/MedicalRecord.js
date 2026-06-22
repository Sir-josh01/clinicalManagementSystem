import mongoose from 'mongoose';

const MedicalRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Patient reference is required']
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Doctor reference is required']
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: [true, 'Appointment reference is required']
    },
    vitals: {
        bloodPressure: { type: String, default: '' }, // e.g., "120/80"
        temperature: { type: String, default: '' },    // e.g., "37.5°C"
        pulseRate: { type: String, default: '' },      // e.g., "72 bpm"
        weight: { type: String, default: '' }          // e.g., "70kg"
    },
    diagnosis: {
        type: String,
        required: [true, 'Diagnosis is required'],
        trim: true
    },
    treatmentPlan: {
        type: String,
        trim: true
    },
    prescriptions: [
        {
            medicineName: { type: String, required: true },
            dosage: { type: String, required: true },       // e.g., "Once daily" or "2 tablets twice a day"
            duration: { type: String, required: true },     // e.g., "5 days"
            isDispelled: { type: Boolean, default: false }  // For the pharmacist to toggle
        }
    ]
}, {
    timestamps: true
});

export default mongoose.model('MedicalRecord', MedicalRecordSchema);