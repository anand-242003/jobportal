import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
    try {

        const hashPassword = await bcrypt.hash(password, 10)
        return hashPassword

    } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error("Failed to hash password");
    }
}
export const comparePassword = async (password, hashPassword) => {
    try {

        const comparePassword = await bcrypt.compare(password, hashPassword);
        return comparePassword
    } catch (error) {
        console.error("Error comparing password:", error);
        throw new Error("Failed to comapare password");
    }
}