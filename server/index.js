//Setup basique du serveur Express
require("dotenv").config();
const port = 3000;
const express = require("express");
const cors = require("cors");
const app = express();
const DB = require("./config/db");
const corsOptions = require("./config/cors");

const authRoutes = require("./routes/authRoutes");
const crudRoutes = require("./routes/crud/union");
const authMiddleware = require("./middlewares/auth");

app.use(cors(corsOptions));
app.use(express.json());

try {
  DB.connect();
} catch (err) {
  console.error("Erreur connexion DB", err);
}

app.use("kairos/auth", authRoutes);
app.use("/kairos",authMiddleware, crudRoutes);

app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});
