import "dotenv/config";
import app from "./app.js";
import { getAuthConfig } from "./config/auth-config.js";

getAuthConfig();

const port = Number(process.env.PORT ?? 3000);

const server = app.listen(port, () => {
    console.log(`ZELO API listening on port ${port}`);
});

function shutdown(): void {
    server.close((error?: Error) => {
        if (error) {
            console.error("Failed to close ZELO API cleanly.", error);
            process.exitCode = 1;
        }
    });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
