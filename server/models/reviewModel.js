const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    reviewerId: 
    { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    revieweeId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    
},{
    timestamps: true,
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

module.exports = Review;
