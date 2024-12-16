// Este archivo configura Handlebars como el motor de plantillas para la aplicación Express,
// estableciendo opciones como el directorio de layouts, el layout por defecto, la extensión de archivo,
// y algunas opciones de tiempo de ejecución para permitir el acceso a propiedades y métodos de prototipos

import { create } from "express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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