const corsOptions = {
  allowedHeaders: ["Content-Type", "Authorization"],
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

module.exports = corsOptions