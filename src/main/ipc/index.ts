import { registerSystemHandlers } from "./systemHandlers";
import { registerUpdateHandlers } from "./updateHandlers";

export function registerIpcHandlers(): void {
    registerSystemHandlers();
    registerUpdateHandlers();

    // Add more handler registrations here as needed
}