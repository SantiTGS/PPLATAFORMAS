/* 02_create_user_collection.js */
db = db.getSiblingDB("jsrl_project");

db.createCollection("users");

// Índice único por email
db.users.createIndex({ email: 1 }, { unique: true });

// Seeds de ejemplo (para pruebas). CONTRASEÑAS EN CLARO (solo demo).
db.users.insertOne({ name: "Juan", email: "j@gmail.com", password: "1234" });
db.users.insertOne({ name: "YuraCOFF", email: "yurayt18@gmail.com", password: "12345*", active: true });

// (Opcional) Esta línea provoca error de “duplicate key” a propósito. Puedes comentarla.
// db.users.insertOne({ name: "YuraCOFF", email: "yurayt18@gmail.com", password: "12345*", active: 1 });

