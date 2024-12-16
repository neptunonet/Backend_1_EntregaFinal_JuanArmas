// Este archivo define el router para la vista de la página de inicio.
// Maneja la ruta principal ("/") y renderiza la plantilla "home" con un título personalizado.
// También incluye manejo de errores básico para problemas de renderización.


import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    try {
        res.render("home", { title: "MobileHub - Tu Tienda" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

export default router;