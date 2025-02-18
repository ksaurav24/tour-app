const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        // eslint-disable-next-line no-undef
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB Connected: ${connection.connection.name}`)
    } catch (error) {
        console.log(`Error in Connecting DB: ${error}`)
        // eslint-disable-next-line no-undef
        process.exit(1)
    }
}

module.exports = connectDB