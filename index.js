const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get("/", (req, res) => {
  console.log(`server is connected`);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
