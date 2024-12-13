import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
      const carts = await cartManager.getAll(); 
      res.render("cart", { carts });
    } catch (error) {
      console.error("Error al obtener los carritos:", error);
      res.status(500).send("Error al obtener los carritos");
    }
  });


router.get("/:id", async (req, res) => {
    try {
        const cart = await cartManager.getOneById(req.params.id, { populate: true });
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});


router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.insertOne(req.body);
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code).json({ status: "error", message: error.message });
    }
});


router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.addOneProduct(cid, pid);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        res.status(200).json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});


router.put("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const updatedCart = await cartManager.updateCart(cid, products);
        res.status(200).json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});


router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});


router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const emptyCart = await cartManager.emptyCart(cid);
        res.status(200).json({ status: "success", payload: emptyCart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;