
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");


dotenv.config();


const app = express();


app.use(cors());
app.use(express.json());




app.use("/api/admin", adminRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
