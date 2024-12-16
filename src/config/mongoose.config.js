// Conecta con la base de datos MongoDB
import { connect, Types } from "mongoose";

export const connectDB = async () => {
    const URL = "mongodb+srv://juancho:1234@cluster0.fd1th.mongodb.net/final";

    try {
        await connect(URL);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.log("Error al conectar con MongoDB", error.message);
    }
};
export const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};