import "./load-env.js";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.info(`server up on port ${port}`);
});
