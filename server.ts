import app from "./app/app.js";
import { config } from "./config/index.js";


app.listen(config.SERVER_PORT, () => {
    console.log(`Listening on port ${config.SERVER_PORT} in ${config.NODE_ENV} mode`);
});

process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});

process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});
