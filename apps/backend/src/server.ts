import "@src/load-env.js";
import { app } from "@src/app.js";

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.info(`server up on port ${port}`);
});
