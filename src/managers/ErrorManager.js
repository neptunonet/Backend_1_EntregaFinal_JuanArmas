// Este archivo define la clase ErrorManager, que extiende la clase Error nativa de JavaScript.
// Proporciona una forma estandarizada de manejar errores en la aplicación, incluyendo
// la asignación de códigos de error HTTP y el manejo específico de errores de validación y duplicados.

export default class ErrorManager extends Error {
    constructor(message, code) {
        super(message);

        this.code = code || 500;
    }
    static handleError(error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((item) => item.message);
            return new ErrorManager(messages.join(",").trim(), 400);
        }

        if (error.code === 11000) {
            return new ErrorManager(error.message, 409);
        }

        return new ErrorManager(error.message, error?.code || 500);
    }
}