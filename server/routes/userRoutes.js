const {Router } = require('express');
const { isLoggedIn, isVerified } = require('../middleware/authMiddleware');
const { getUserProfile, getUserPublicProfile, addReview, getUserTrips, updateUserProfile } = require('../controller/userController');

const router = Router()

router.get('/profile',isLoggedIn,isVerified,getUserProfile)

router.put('/profile',isLoggedIn,isVerified,updateUserProfile)


router.post('/review/add',isLoggedIn,isVerified,addReview)

router.get('/myTrips',isLoggedIn,isVerified,getUserTrips)
router.get('/:username',isLoggedIn,isVerified,getUserPublicProfile)

module.exports = router;