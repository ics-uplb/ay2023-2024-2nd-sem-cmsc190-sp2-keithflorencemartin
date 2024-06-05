const express = require("express");
const router = express.Router();
const multer = require("multer");

const authRoute = require("../controllers/AuthController.js");
const userRoute = require("./UserRoute.js");
const organismRoute = require("./OrganismRoute.js");
const sampleRoute = require("./SampleRoute.js");
const hostRoute = require("./HostRoute.js");
const locationRoute = require("./LocationRoute.js");
const caveRoute = require("./CaveRoute.js");
const samplingPointRoute = require("./SamplingPointRoute.js");
const isolateRoute = require("./IsolateRoute.js");
const methodRoute = require("./MethodRoute.js");
const institutionRoute = require("./InstitutionRoute.js");
const collectionRoute = require("./CollectionRoute.js");

router.use("/register", multer().none(), authRoute.register);
router.use("/login", multer().none(), authRoute.login);
router.use("/user", multer().none(), userRoute);
router.use("/organism", multer().none(), organismRoute);
router.use("/sample", multer().none(), sampleRoute);
router.use("/host", multer().none(), hostRoute);
router.use("/location", multer().none(), locationRoute);
router.use("/cave", multer().none(), caveRoute);
router.use("/samplingPoint", multer().none(), samplingPointRoute);
router.use("/isolate", multer().none(), isolateRoute);
router.use("/method", multer().none(), methodRoute);
router.use("/institution", multer().none(), institutionRoute);
router.use("/collection", multer().none(), collectionRoute);

module.exports = router;
