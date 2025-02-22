const app = require('./app');
// eslint-disable-next-line no-undef
const port = process.env.PORT || 8000;
const connectDB = require('./config/dbConfig');
const passport = require("passport");
const{ initializingPassport} = require('./config/passportConfig')
const swaggerDocs = require('./config/swagger');
swaggerDocs(app, port);

initializingPassport(passport)

app.use(passport.initialize());
app.use(passport.session());
 
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.log(`Error in connecting to DB: ${error}`);
    // eslint-disable-next-line no-undef
    process.exit(1);
});