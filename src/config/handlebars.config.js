import handlebars from "express-handlebars";
import paths from "../utils/paths.js";

// Configura el servidor para usar Handlebars como motor de plantillas
export const config = (app) => {
    app.engine("handlebars", handlebars.engine());
    app.set("views", paths.views);
    app.set("view engine", "handlebars");
};