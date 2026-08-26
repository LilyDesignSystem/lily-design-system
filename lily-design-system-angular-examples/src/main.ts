import { bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app";
import { config } from "./app/app.config";
import "./styles/app-shell.css";

bootstrapApplication(App, config).catch((err) => console.error(err));
