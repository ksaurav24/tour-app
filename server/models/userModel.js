const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true,
         }, // Store the *hash*
        firstName: { type: String },
        lastName: { type: String },
        isVerified: { type: Boolean, default: false },
        googleId: { type: String, select: false, unique: true },
        dateOfBirth: { type: Date },
        profilePicture: { type: String }, // URL
        bio: { type: String },
        interests: { type: [String] }, // Array of strings
        travelStyle: { type: String },
        pastTrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' 
            ,default: []
        }], // Reference to Trip model
        reviews: [{ type: Schema.Types.ObjectId, ref: 'Review',
            default: []
         }], // Reference to Review model
        verificationToken: { type: String },
        verificationTokenExpiry:{
            type:Date
        },
        resetPasswordToken:{
            type:String
        },
        resetPasswordTokenExpiry:{
            type:Date
        },
        joinRequests:[{ type: Schema.Types.ObjectId, ref: 'Trip' }],
        notifications:[{ type: Schema.Types.ObjectId, ref: 'Notification' }],
        socialMedia: {
            facebook: { type: String },
            twitter: { type: String },
            instagram: { type: String },
            linkedIn: { type: String },
        },
        
    },
    {
        timestamps: true,
    },
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
