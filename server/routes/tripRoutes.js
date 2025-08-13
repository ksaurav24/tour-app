const {Router} = require('express');
const { isLoggedIn, isVerified } = require('../middleware/authMiddleware');
const { joinTrip,
    createTrip,
    getTrip,
    getTrips,
    updateTrip,
    acceptJoinRequest,
    cancelTrip} = require('../controller/tripController');

const router = Router();

router.post('/create',isLoggedIn,isVerified,createTrip)

router.get('/:id',isLoggedIn,isVerified,getTrip)

router.get('/',isLoggedIn,isVerified,getTrips)

router.put('/:id',isLoggedIn,isVerified,updateTrip)

router.delete('/:id',isLoggedIn,isVerified,cancelTrip)

router.post('/join/:id',isLoggedIn,isVerified,joinTrip)

router.post('accept-join-request/:id',isLoggedIn,isVerified,acceptJoinRequest)

module.exports = router;