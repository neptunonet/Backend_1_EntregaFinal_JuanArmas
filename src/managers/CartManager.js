import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import CartModel from "../models/cart.model.js";

export default class CartManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }

    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }

        const cart = await this.#cartModel.findById(id).populate("products.product");

        if (!cart) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cart;
    }
    async getAll() {
      try {
        const carts = await this.#cartModel.find().populate('products.product');
        return carts;
      } catch (error) {
        throw new ErrorManager("Error al obtener los carritos", 500);
      }
    }

    
    async getOneById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
    async insertOne(data) {
        try {
            const cart = await this.#cartModel.create(data);
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
    async addOneProduct(id, productId) {
        try {
            const cart = await this.#findOneById(id);
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex >= 0) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async removeProductFromCart(cartId, productId) {
        if (!isValidID(cartId) || !isValidID(productId)) {
          throw new ErrorManager("ID inválido", 400);
        }
    
        const cart = await this.#cartModel.findByIdAndUpdate(
          cartId,
          { $pull: { products: { product: productId } } },
          { new: true }
        ).populate("products.product");
    
        if (!cart) {
          throw new ErrorManager("Carrito no encontrado", 404);
        }
    
        return cart;
      }
    
      async updateCart(cartId, products) {
        if (!isValidID(cartId)) {
          throw new ErrorManager("ID inválido", 400);
        }
    
        const cart = await this.#cartModel.findByIdAndUpdate(
          cartId,
          { products },
          { new: true }
        ).populate("products.product");
    
        if (!cart) {
          throw new ErrorManager("Carrito no encontrado", 404);
        }
    
        return cart;
      }
    
      async updateProductQuantity(cartId, productId, quantity) {
        if (!isValidID(cartId) || !isValidID(productId)) {
          throw new ErrorManager("ID inválido", 400);
        }
    
        const cart = await this.#cartModel.findOneAndUpdate(
          { _id: cartId, "products.product": productId },
          { $set: { "products.$.quantity": quantity } },
          { new: true }
        ).populate("products.product");
    
        if (!cart) {
          throw new ErrorManager("Carrito o producto no encontrado", 404);
        }
    
        return cart;
      }
    
      async emptyCart(cartId) {
        if (!isValidID(cartId)) {
          throw new ErrorManager("ID inválido", 400);
        }
    
        const cart = await this.#cartModel.findByIdAndUpdate(
          cartId,
          { products: [] },
          { new: true }
        );
    
        if (!cart) {
          throw new ErrorManager("Carrito no encontrado", 404);
        }
    
        return cart;
      }
    
      async getOneById(id, options = {}) {
        if (!isValidID(id)) {
          throw new ErrorManager("ID inválido", 400);
        }

        const query = this.#cartModel.findById(id);

        if (options.populate) {
          query.populate("products.product");
        }

        const cart = await query.exec();

        if (!cart) {
          throw new ErrorManager("ID no encontrado", 404);
        }

        return cart;
      }
}