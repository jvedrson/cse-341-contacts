const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const app = express();
const port = process.env.PORT || 8080;

const mongoDB = require("./db/database");

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/contacts", require("./routes/contacts"));

mongoDB.initDatabase((err) => {
  if (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
  app.listen(port, () => {
    console.log(`Database is listening and node Running on port ${port}`);
  });
});
