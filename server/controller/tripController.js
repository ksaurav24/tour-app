const Trip = require("../models/tripModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const getLogger = require("../utils/logger");

const logger = getLogger('TripController');

const createTrip = asyncHandler(async (req, res) => {
    try {
        const { destinationId, startingPointId, startDate, endDate, budget, description, interests, travelStyle, groupSize, isGroupTrip,isPrivate, whatsappLink, telegramLink, discordLink } = req.body;
        logger.info('Creating new trip', { userId: req.user._id, destinationId });

        const trip = await Trip.create({
            destinationId,
            startingPointId,
            startDate,
            endDate,
            budget,
            interests,
            travelStyle,
            groupSize,
            isGroupTrip,
            description,
            creatorId: req.user._id,
            participants: [req.user._id],
            isPrivate,
            whatsappLink,
            telegramLink,
            discordLink
        });

        logger.info('Trip created successfully', { tripId: trip._id, userId: req.user._id });
        res.status(201).send(new ApiResponse(201, trip, "Trip created successfully"));
    } catch (error) {
        logger.error('Error creating trip', { userId: req.user._id, error: error.message });
        throw new ApiError(500, error);
    }
});

const getTrip = asyncHandler(async (req, res) => {
    try {
        logger.info('Fetching trip details', { tripId: req.params.id });
        const data = await Trip.findById(req.params.id).populate("creatorId").populate("participants");
        if (!data) {
            logger.warn('Trip not found', { tripId: req.params.id });
            throw new ApiError(404, "Trip not found");
        }
        logger.info('Trip retrieved successfully', { tripId: req.params.id });
        res.status(200).send(new ApiResponse(200, data, "Trip retrieved successfully"));
    } catch (error) {
        logger.error('Error fetching trip', { tripId: req.params.id, error: error.message });
        throw new ApiError(500, error);
    }
});

const getTrips = asyncHandler(async (req, res) => {
    try {
        logger.info('Fetching all trips');
        const trips = await Trip.find().populate("creatorId").populate("participants");
        logger.info('Trips retrieved successfully', { count: trips.length });
        res.status(200).send(new ApiResponse(200, trips, "Trips retrieved successfully"));
    } catch (error) {
        logger.error('Error fetching trips', { error: error.message });
        throw new ApiError(500, error);
    }
});

const updateTrip = asyncHandler(async (req, res) => {
    try {
        const { destinationId, startingPointId, startDate, endDate, budget, description, interests, travelStyle, groupSize, isGroupTrip,isPrivate, whatsappLink, telegramLink, discordLink } = req.body;
        logger.info('Updating trip', { tripId: req.params.id, userId: req.user._id });

        const trip = await Trip.findOne({
            _id: req.params.id,
            creatorId: req.user._id
        });
        if (!trip) {
            logger.warn('Trip not found for update', { tripId: req.params.id, userId: req.user._id });
            throw new ApiError(404, "Trip not found");
        }
        
        Object.assign(trip, { destinationId, startingPointId, startDate, endDate, budget, description, interests, travelStyle, groupSize, isGroupTrip, isPrivate, whatsappLink, telegramLink, discordLink });
        await trip.save();
        
        logger.info('Trip updated successfully', { tripId: req.params.id });
        res.status(200).send(new ApiResponse(200, trip, "Trip updated successfully"));
    } catch (error) {
        logger.error('Error updating trip', { tripId: req.params.id, userId: req.user._id, error: error.message });
        throw new ApiError(500, error);
    }
});

const deleteTrip = asyncHandler(async (req, res) => {
    try {
        logger.info('Deleting trip', { tripId: req.params.id, userId: req.user._id });
        const trip = await Trip.findOne({
            _id: req.params.id,
            creatorId: req.user._id
        });
        if (!trip) {
            logger.warn('Trip not found for deletion', { tripId: req.params.id, userId: req.user._id });
            throw new ApiError(404, "Trip not found");
        }
        await trip.remove();
        logger.info('Trip deleted successfully', { tripId: req.params.id });
        res.status(200).send(new ApiResponse(200, null, "Trip deleted successfully"));
    } catch (error) {
        logger.error('Error deleting trip', { tripId: req.params.id, userId: req.user._id, error: error.message });
        throw new ApiError(500, error);
    }
});

const joinTrip = asyncHandler(async (req, res) => {
    try {
        logger.info('User attempting to join trip', { tripId: req.params.id, userId: req.user._id });
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            logger.warn('Trip not found for joining', { tripId: req.params.id });
            throw new ApiError(404, "Trip not found");
        }
        if (trip.participants.includes(req.user._id)) {
            logger.warn('User already a participant', { tripId: req.params.id, userId: req.user._id });
            throw new ApiError(400, "You are already a participant of this trip");
        }
        if(trip.isPrivate){
            trip.joinRequests.push(req.user._id);
            await trip.save();
            logger.info('Join request sent successfully', { tripId: req.params.id, userId: req.user._id });
            return res.status(200).send(new ApiResponse(200, trip, "Join request sent successfully"));
        }
        else{
            trip.participants.push(req.user._id);
            await trip.save();
            logger.info('User joined trip successfully', { tripId: req.params.id, userId: req.user._id });
            res.status(200).send(new ApiResponse(200, trip, "You have joined the trip successfully"));
        }
    } catch (error) {
        logger.error('Error joining trip', { tripId: req.params.id, userId: req.user._id, error: error.message });
        throw new ApiError(500, error);
    }
});

const searchTrip = asyncHandler(async (req, res) => {
    try {
        const { destinationId, startingPointId, startDate, endDate, travelStyle, groupSize, isGroupTrip } = req.query;
        logger.info('Searching for trips', { ...req.query });

        const query = {};
        if (destinationId) query.destinationId = destinationId;
        if (startingPointId) query.startingPointId = startingPointId;
        if (startDate && endDate) {
            query.startDate = { $gte: new Date(startDate) };
            query.endDate = { $lte: new Date(endDate) };
        } else if (startDate) {
            query.startDate = { $gte: new Date(startDate) };
        } else if (endDate) {
            query.endDate = { $lte: new Date(endDate) };
        }
        if (travelStyle) query.travelStyle = new RegExp(travelStyle, 'i');
        if (groupSize) query.groupSize = { $lte: parseInt(groupSize) };
        if (isGroupTrip !== undefined) query.isGroupTrip = isGroupTrip.toLowerCase() === 'true';

        const trips = await Trip.find(query)
            .populate("creatorId", "userName email")
            .populate("participants", "userName email")
            .lean()
            .exec();

        if (trips.length === 0) {
            logger.info('No trips found matching criteria', { ...req.query });
            return res.status(404).send(new ApiResponse(404, [], "No trips found matching the criteria"));
        }

        logger.info('Trips found successfully', { count: trips.length });
        res.status(200).send(new ApiResponse(200, trips, "Trips retrieved successfully"));
    } catch (error) {
        logger.error('Error searching for trips', { error: error.message, query: req.query });
        throw new ApiError(500, "An error occurred while searching for trips");
    }
});

const acceptJoinRequest = asyncHandler(async(req,res)=>{
    try {
        const tripId = req.params.id;
        const {RequesterId} = req.body;
        const trip = await Trip.findOne({
            _id:tripId,
            creatorId:req.user_id
        });
        if (!trip) {
            logger.warn('Trip not found for joining', { tripId: req.params.id });
            throw new ApiError(404, "Trip not found");
        }
        if(!trip.joinRequests.includes(RequesterId)){
            logger.warn('User not found in join requests', { tripId: req.params.id, userId: req.user._id });
            throw new ApiError(404, "User not found in join requests");
        }
        trip.participants.push(RequesterId);
        trip.joinRequests = trip.joinRequests.filter(id=>id!==RequesterId);
        await trip.save();
        logger.info('User joined trip successfully', { tripId: req.params.id, userId: req.user._id });
        res.status(200).send(new ApiResponse(200, trip, "You have joined the trip successfully"));
        
        
    } catch (error) {
        logger.error('Error searching for trips', { error: error.message, user: req.user_id, trip:req.params.id });
    }
})

module.exports = {
    searchTrip,
    joinTrip,
    createTrip,
    getTrip,
    getTrips,
    updateTrip,
    deleteTrip,
    acceptJoinRequest
};
