const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD || "user_secret_jwt_key_coursify_2026";
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD || "admin_secret_jwt_key_coursify_2026";

module.exports = {
    JWT_USER_PASSWORD,
    JWT_ADMIN_PASSWORD
};