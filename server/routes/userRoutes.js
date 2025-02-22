const {Router } = require('express');
const { isLoggedIn, isVerified } = require('../middleware/authMiddleware');
const { getUserProfile, getUserPublicProfile, addReview, getUserJoinedTrips, updateUserProfile,getJoinRequestsOfUser } = require('../controller/userController');

const router = Router()

router.get('/profile',isLoggedIn,isVerified,getUserProfile)

router.put('/profile',isLoggedIn,isVerified,updateUserProfile)

router.get('/:id',isLoggedIn,isVerified,getUserPublicProfile)

router.post('/review/add',isLoggedIn,isVerified,addReview)
 
router.get('/joined-trips',isLoggedIn,isVerified,getUserJoinedTrips)

router.get('/pending-request-trips',isLoggedIn,isVerified,getJoinRequestsOfUser)

module.exports = router;