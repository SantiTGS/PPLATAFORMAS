/* 01_create_user.js */
db = db.getSiblingDB("jsrl_project");

db.createUser({
  user: "api_user",
  pwd: "api1234",
  roles: [{ role: "readWrite", db: "jsrl_project" }],
});
