import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

console.log("Current working directory:", process.cwd());
console.log("Environment variables loaded:", {
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY ? "Exists" : "Missing",
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY ? "Exists" : "Missing",
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT ? "Exists" : "Missing",
});


const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;

