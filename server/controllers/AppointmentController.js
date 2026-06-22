import Appointment from '../models/Appointment.js';

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patients or Admins can book)
export const bookAppointment = async (req, res) => {
    const { doctor, appointmentDate, reasonForVisit } = req.body;

    try {
        const appointment = await Appointment.create({
            patient: req.user._id, // Automatically pulled from our protect middleware
            doctor,
            appointmentDate,
            reasonForVisit
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Get all appointments for the logged-in user
// @route   GET /api/appointments
// @access  Private
export const getMyAppointments = async (req, res) => {
    try {
        let appointments;

        // If the logged-in user is a doctor, find appointments where they are assigned
        if (req.user.role === 'doctor') {
            appointments = await Appointment.find({ doctor: req.user._id })
                .populate('patient', 'firstName lastName email phoneNumber');
        } 
        // If they are a patient, find their personal appointments
        else if (req.user.role === 'patient') {
            appointments = await Appointment.find({ patient: req.user._id })
                .populate('doctor', 'firstName lastName email');
        } 
        // Admins see everything across the entire hospital system
        else if (req.user.role === 'admin') {
            appointments = await Appointment.find()
                .populate('patient', 'firstName lastName')
                .populate('doctor', 'firstName lastName');
        }

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};