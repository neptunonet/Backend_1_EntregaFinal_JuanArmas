import ErrorManager from "./ErrorManager.js";
import { isValidID } from "../config/mongoose.config.js";
import ProductModel from "../models/product.model.js";
import { convertToBoolean } from "../utils/converter.js";

export default class ProductManager {
    #productModel;

    constructor() {
        this.#productModel = ProductModel;
    }
    async #findOneById(id) {
        if (!isValidID(id)) {
            throw new ErrorManager("ID inválido", 400);
        }

        const product = await this.#productModel.findById(id);

        if (!product) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return product;
    }
    async getAll(params) {
        try {
            const $and = [];

            if (params?.title) $and.push({ title: { $regex: params.title, $options: "i" } });
            if (params?.category) $and.push({ category: params.category });
            if (params?.status) $and.push({ status: params.status === 'true' });

            const filters = $and.length > 0 ? { $and } : {};

            const sort = {};
            if (params?.sort === 'asc' || params?.sort === 'desc') {
                sort.title = params.sort === 'asc' ? 1 : -1;
            }
            if (params?.priceOrder === 'asc' || params?.priceOrder === 'desc') {
                sort.price = params.priceOrder === 'asc' ? 1 : -1;
            }

            const paginationOptions = {
                limit: params?.limit || 10,
                page: params?.page || 1,
                sort: sort,
                lean: true,
            };

            return await this.#productModel.paginate(filters, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }


    async getCategories() {
        try {
            const categories = await this.#productModel.distinct('category');
            return categories;
        } catch (error) {
            throw ErrorManager.handleError(error);
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
            const product = await this.#productModel.create({
                ...data,
                status: convertToBoolean(data.status),
            });

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
    async updateOneById(id, data) {
        try {
            const product = await this.#findOneById(id);
            const newValues = {
                ...product,
                ...data,
                status: data.status ? convertToBoolean(data.status) : product.status,
            };

            product.set(newValues);
            product.save();

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async deleteOneById(id) {
        try {
            const product = await this.#findOneById(id);
            await product.deleteOne();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}
