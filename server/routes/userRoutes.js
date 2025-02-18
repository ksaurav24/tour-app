const {Router } = require('express');
const { isLoggedIn, isVerified } = require('../middleware/authMiddleware');
const { getUserProfile, getUserPublicProfile, addReview, getUserPastTrips, updateUserProfile } = require('../controller/userController');

const router = Router()

router.get('/profile',isLoggedIn,isVerified,getUserProfile)

router.put('/profile',isLoggedIn,isVerified,updateUserProfile)

router.get('/:id',isLoggedIn,isVerified,getUserPublicProfile)

router.post('/review/add',isLoggedIn,isVerified,addReview)

router.get('/past-trips',isLoggedIn,isVerified,getUserPastTrips)

module.exports = router;