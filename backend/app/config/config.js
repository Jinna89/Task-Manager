export const PORT = process.env.PORT || 5050;
export const DATABASE = process.env.DATABASE;
export const JWT_KEY = process.env.JWT_KEY;
export const JWT_EXPIRE_TIME = 30 * 24 * 60 * 60;

export const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
export const EMAIL_PORT = process.env.EMAIL_PORT || 465;
export const EMAIL_SECURITY = process.env.EMAIL_SECURITY === "true";
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const EMAIL_UN_AUTH = process.env.EMAIL_UN_AUTH === "true";

export const WEB_CACHE = process.env.WEB_CACHE === "true";
export const MAX_JSON_SIZE = process.env.MAX_JSON_SIZE || "50MB";
export const URL_ENCODE = process.env.URL_ENCODE || "50MB";

export const REQUEST_TIME = process.env.REQUEST_TIME || 20 * 60 * 1000;
export const REQUEST_NUMBER = process.env.REQUEST_NUMBER || 2000;
