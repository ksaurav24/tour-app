const User = require("../models/userModel");
const Review = require("../models/reviewModel");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require('mongoose');
const getLogger = require("../utils/logger");
const Trip = require("../models/tripModel");

const logger = getLogger('UserController');

const getUserProfile = asyncHandler(async (req, res) => {
  try {
    logger.info('Fetching user profile', { userId: req.user._id });
    const data = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "revieweeId",
          as: "reviews"
        }
      },
       
      {
        $lookup:{
          from: "trips",
          localField: "_id",
          foreignField: "creatorId",
          as: "createdTrips"
        }
      },
      {
        $project: {
          passwordHash: 0,
          googleId: 0,
          verificationToken: 0,
          verificationTokenExpiry: 0,
          resetPasswordToken: 0,
          resetPasswordTokenExpiry: 0
        }
      }
    ]);

    logger.info('User profile retrieved successfully', { userId: req.user._id });
    res.status(200).json(new ApiResponse(200, data[0], "User profile retrieved successfully"));
  } catch (error) {
    console.log(error)
    logger.error('Error fetching user profile', { userId: req?.user?._id, error: error?.message });
    res.status(500).send(new ApiResponse(500, null, "Internal server error"));
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    logger.info('Updating user profile', { userId: req.user._id });
    const {  bio, interests, travelStyle, socialMedia } = req.body;
    console.log(socialMedia)
    const user = await User.findByIdAndUpdate(req.user._id, {
        bio,
        interests,
        travelStyle,
        socialMedia
    }, { new: true }).select("-passwordHash -googleId -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordTokenExpiry");
    console.log(user.socialMedia)
    logger.info('User profile updated successfully', { userId: req.user._id });
    res.status(200).json(new ApiResponse(200, user, "User profile updated successfully"));
    } catch (error) {
    logger.error('Error updating user profile', { userId: req.user._id, error: error.message });
    res.status(500).send(new ApiResponse(500, null, "Internal server error"));
    }
});

const getUserJoinedTrips = asyncHandler(async (req, res) => {
  try {
    logger.info('Fetching user joined trips', { userId: req.user._id });
    const trips = await Trip.aggregate([
      {
        $match: {
          participants: new mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "creatorId",
          foreignField: "_id",
          as: "creator"
        }
      },
      {
        $project: {
          creator: {
            username: 1,
            profilePicture: 1
          },
          destination: 1,
          startDate: 1,
          endDate: 1,
          budget: 1,
          title: 1,
          description: 1,
          interests: 1,
          travelStyle: 1,
          isGroupTrip: 1,
          groupSize: 1,
          whatsappLink: 1,
          telegramLink: 1,
          discordLink: 1
        }
      }
    ])

    logger.info('User joined trips retrieved successfully', { userId: req.user._id, tripCount: trips.length });
    res.status(200).json(new ApiResponse(200, trips, "User joined trips retrieved successfully"));

  } catch (error) {
    logger.error('Error fetching user joined trips', { userId: req.user._id, error: error.message });
    res.status(500).send(new ApiResponse(500, null, "Internal server error"));
  }
});

const getUserPublicProfile = asyncHandler(async (req, res) => {
  try {
    logger.info('Fetching public user profile', { userId: req.params.id });
    const data = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id)
        }
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "revieweeId",
          as: "reviews"
        }
      },

      {
        $project: {
          username: 1,
          firstName: 1,
          lastName: 1,
          profilePicture: 1,
          bio: 1,
          interests: 1,
          travelStyle: 1,
          reviews: 1,
          createdTrips: 1
        }
      }
    ]);

    if (!data.length) {
      logger.warn('User not found', { userId: req.params.id });
      return res.status(404).send(new ApiResponse(404, null, "User not found"));
    }

    logger.info('Public user profile retrieved successfully', { userId: req.params.id });
    res.status(200).json(new ApiResponse(200, data[0], "User profile retrieved successfully"));
  } catch (error) {
    logger.error('Error fetching public user profile', { userId: req.params.id, error: error.message });
    res.status(500).send(new ApiResponse(500, null, "Internal server error"));
  }
});

 
const addReview = asyncHandler(async (req, res) => {
  try {
    const { comment, rating, revieweeId } = req.body;
    logger.info('Adding review', { reviewerId: req.user._id, revieweeId });

    const reviewee = await User.findById(revieweeId);
    if (!reviewee) {
      logger.warn('Reviewee not found', { revieweeId });
      return res.status(404).send(new ApiResponse(404, null, "User not found"));
    }

    const review = await Review.create({
      comment,
      rating,
      reviewerId: req.user._id,
      revieweeId
    });

    reviewee.reviews.push(review._id);
    await reviewee.save();

    logger.info('Review added successfully', { reviewId: review._id, revieweeId });

    res.status(201).json(new ApiResponse(201, review, "Review created successfully"));
  } catch (error) {
    logger.error('Error adding review', { reviewerId: req.user._id, revieweeId: req.body.revieweeId, error: error.message });
    res.status(500).send(new ApiResponse(500, null, "Internal server error"));
  }
});

const getJoinRequestsOfUser = asyncHandler(async (req, res) => {
  try {

    logger.info('Fetching join requests', { userId: req?.user?._id });
    // Find all trips where the user is the join request array
    const user = await User.findById(req.user?._id).populate('joinRequests');
    if(!user) {
      logger.warn('User not found', { userId: req?.user?._id });
      return res.status(404).send(new ApiResponse(404, null, "User not found"));
    }
    
    const trips = user.joinRequests;

    if(!trips.length) {
      logger.warn('No join requests found', { userId: req.user?._id });
      return res.status(404).send(new ApiResponse(404, null, "No join requests found"));
    }

    logger.info('Join requests retrieved successfully', { userId: req.user._id, tripCount: trips.length });
    res.status(200).json(new ApiResponse(200, trips, "Join requests retrieved successfully"))
    
    
  } catch (error) {
    logger.error('Error fetching join requests', { userId: req.user._id, error: error.message });
    res.status(500).send(new ApiResponse(500, null, "Internal server error"));
  }
});

module.exports = {
  getJoinRequestsOfUser,
  getUserJoinedTrips,
    updateUserProfile,
  getUserProfile, 
  addReview,
  getUserPublicProfile
};
