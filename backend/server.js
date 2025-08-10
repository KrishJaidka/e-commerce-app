require("dotenv").config({ quiet: true });

const express = require("express");
const fileUpload = require("express-fileupload");
const connectDB = require("./databases/connection");
const cloudinaryConnect = require("./databases/cloudinary");
// const userRoute = require("./routes/userRoutes")
// const productRoute = require("./routes/productRoutes")
// const salesRoute = require("./routes/salesRoutes")
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

connectDB();
cloudinaryConnect();

// app.use("/api/user", userRoute);
// app.use("/api/product", productRoute);

app.listen(PORT, () => {
  console.log(`Server up and running on port ${PORT}`);
});

//add reviews to products
//payment schema
//support-tickets schema
