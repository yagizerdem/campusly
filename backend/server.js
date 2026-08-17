const { join } = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: [join(__dirname, ".env.dev"), join(__dirname, ".env.prod")],
  override: true,
});

const { app } = require("./app");

const PORT = process.env.PORT;
c;

app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
