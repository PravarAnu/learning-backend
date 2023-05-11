import dotenv from "dotenv"

dotenv.config();

const config = {
    PORT: process.env.PORT || 5000,
    MONGODB_URL: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/ecomm",
    JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
    JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY ||"youraccesskey",
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY ||"yoursecretaccesskey",
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ||"youruniquebucketname",
    S3_REGION: process.env.S3_REGION ||"yourregion",
    SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST,
    SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
    SMTP_MAIL_UESRNAME: process.env.SMTP_MAIL_UESRNAME,
    SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,
    SMTP_SENDER_EMAIL: process.env.SMTP_SENDER_EMAIL
}

export default config;