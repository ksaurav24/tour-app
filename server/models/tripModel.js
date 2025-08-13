const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    creatorId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    destination: { type: String, required: true },
    startingPoint: { type: String },
    destinationId: { type: String },
    startingPointId: { type: String },
    longitude: { type: Number },
    latitude: { type: Number },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    budget: { type: String },
    title:{type:String},
    description: { type: String },
    interests: { type: [String],default:[] },
    travelStyle: { type: String },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    groupSize: { type: Number },
    isGroupTrip: { type: Boolean, default: false },
    isPrivate:{
      type:Boolean,
      default:false
    },
    joinRequests:[{ type: Schema.Types.ObjectId, ref: 'User' }],
    whatsappLink: { type: String, default:"" },
    telegramLink: { type: String, default:"" },
    discordLink: { type: String , default:""},
    isCanceled:{type:Boolean, default:false}
    
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);

module.exports = Trip;
