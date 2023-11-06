const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const fileRoutes = require("./routes/file.routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/user/files", fileRoutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
