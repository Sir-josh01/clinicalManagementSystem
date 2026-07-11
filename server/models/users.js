import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'nurse', 'pharmacist', 'patient'],
        default: 'patient'
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Fields for password reset functionality
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
    timestamps: true // Automatically generates createdAt and updatedAt timestamps
});

// Pre-save Middleware: Hash passwords before saving to the database
UserSchema.pre('save', async function() {
    // Only hash the password if it's new or being modified
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
    } catch (error) {
        next(error);
    }
});

// Instance Method: Compare entered password with hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await compare(enteredPassword, this.password);
};

export default model('User', UserSchema);