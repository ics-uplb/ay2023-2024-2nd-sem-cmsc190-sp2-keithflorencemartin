require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const Isolate = require("./models/IsolateInfo.js");
const { v4: uuidv4 } = require("uuid");
const router = require("./routes/index.js");
const db = require("./config/database.js");
const cloudinaryConfig = require("./config/cloudinaryConfig.js");
const {
  requestMiddleware,
  errorMiddleware,
} = require("./middleware/logger.js");
const { specs, swaggerUi } = require("./swagger.js");
const port = process.env.APP_PORT;
const host = process.env.APP_HOST;
const app = express();

const { verifyToken, requireRole } = require("./middleware/auth.js");

cloudinary.config(cloudinaryConfig);

(async () => {
  try {
    await db.authenticate();
    console.log("Database connected.");
  } catch (error) {
    console.error("Connection error:", error);
  }
})();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(requestMiddleware);

const upload = multer({ dest: "uploads/", bodyparser: true });
app.post(
  "/image/upload/:isolateId",
  verifyToken,
  requireRole(["Admin", "Researcher", "update_isolate_info"]),
  upload.single("image"),
  async (req, res) => {
    try {
      const imagePath = req.file.path;

      // Check first if the isolate exists
      const isolate = await Isolate.findOne({
        where: {
          id: req.params.isolateId,
        },
      });

      if (!isolate) {
        const error = new Error(
          `Isolate with ID ${req.params.isolateId} not found.`
        );
        error.status = 404;
        throw error;
      }

      const uuid = uuidv4();
      const image_ref = uuid;

      await Isolate.update(
        { image_ref },
        { where: { id: req.params.isolateId } }
      );

      const result = await cloudinary.uploader.upload(imagePath, {
        public_id: `${uuid}`,
        folder: "isolate-pictures",
      });

      await fs.promises.unlink(imagePath);
      res.json({ public_id: result.public_id, url: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

app.delete(
  "/image/delete/:isolateId",
  verifyToken,
  requireRole(["Admin", "Researcher", "delete_isolate_info"]),
  async (req, res) => {
    try {
      // Check first if the isolate exists
      const isolate = await Isolate.findOne({
        where: {
          id: req.params.isolateId,
        },
      });

      if (!isolate) {
        const error = new Error(
          `Isolate with ID ${req.params.isolateId} not found.`
        );
        error.status = 404;
        throw error;
      }

      let imageRef = isolate.image_ref;

      const publicId = "isolate-pictures/" + imageRef;
      const result = await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
      });

      if (!result) {
        return res.status(404).json({ message: "Image not found" });
      }

      await Isolate.update(
        { image_ref: null },
        { where: { id: req.params.isolateId } }
      );

      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.log("Error in app.js deleting image:", error);
      res.status(500).json({ message: "Delete failed" });
    }
  }
);

// app.use((req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     // "https://main--caveis.netlify.app/"
//     "http://localhost:3000"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, HEAD, OPTIONS, POST, PUT, DELETE"
//   );
// });
app.use("/", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(errorMiddleware);
app.listen(port, host, () => {
  console.log("Server listening on", host + ": " + port);
});
