const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: false,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.transaction = require("../models/transaction.model.js")(sequelize, Sequelize);
db.refreshJwt = require("../models/refreshJwt.model.js")(sequelize, Sequelize);

db.user.hasMany(db.transaction, { as: "transactions", onDelete: "CASCADE" });
db.transaction.belongsTo(db.user, {
  foreignKey: { allowNull: false, name: "userId" },
  as: "createdBy",
});

db.refreshJwt.belongsTo(db.user, {
  foreignKey: "userId",
  targetKey: "id",
});
db.user.hasOne(db.refreshJwt, {
  foreignKey: "userId",
  targetKey: "id",
});

module.exports = db;
