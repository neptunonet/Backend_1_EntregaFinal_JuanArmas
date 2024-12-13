import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

//Ruta para obtener los productos
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll(req.query);
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, category, status, priceOrder } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? JSON.parse(sort) : undefined
        };
        const filter = {};
        if (category) filter.category = category; // Asegúrate de que esta línea esté presente
        if (status) filter.status = status === 'true';

        const result = await productManager.getProducts(filter, options, priceOrder);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/categories', async (req, res) => {
    try {
        const categories = await productManager.getCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener un producte por su ID
router.get("/:id", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Ruta para crear un producte
router.post("/", async (req, res) => {
    try {
        const product = await productManager.insertOne(req.body);
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Ruta para actualizar un producte por su ID
router.put("/:id", async (req, res) => {
    try {
        const product = await productManager.updateOneById(req.params.id, req.body);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});

// Ruta para eliminar un producte por su ID
router.delete("/:id", async (req, res) => {
    try {
        await productManager.deleteOneById(req.params.id);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});


export default router;