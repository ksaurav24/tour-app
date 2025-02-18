const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema(
  {
    creatorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    destination: { type: String, required: true },
    startingPoint: { type: String },
    destinationId: { type: String },
    startingPointId: { type: String },
    longitude: { type: Number },
    latitude: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    budget: { type: String },
    description: { type: String },
    interests: { type: [String] },
    travelStyle: { type: String },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    groupSize: { type: Number },
    isGroupTrip: { type: Boolean, default: false },
    isPrivate:{
      type:Boolean,
      default:false
    },
    joinRequests:[{ type: Schema.Types.ObjectId, ref: 'User' }],
    whatsappLink: { type: String },
    telegramLink: { type: String },
    discordLink: { type: String },
    
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);

module.exports = Trip;
