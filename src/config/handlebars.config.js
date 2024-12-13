import { create } from "express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configura el servidor para usar Handlebars como motor de plantillas
export const config = (app) => {
    const hbs = create({
        helpers: {
            cartUrl: () => '/cart',
        },
        layoutsDir: path.join(__dirname, '..', 'views', 'layouts'),
        defaultLayout: "main",
        extname: ".handlebars",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }
    });

    app.engine("handlebars", hbs.engine);
    app.set("views", path.join(__dirname, '..', 'views'));
    app.set("view engine", "handlebars");
};