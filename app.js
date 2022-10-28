const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

// parse request berbentuk json
app.use(bodyParser.json());

// parse request form/url-encoded
app.use(bodyParser.urlencoded({ extended: true }));

require("./routes/auth.routes")(app);
require("./routes/transaction.routes")(app);

const db = require("./models");

const User = db.user;
const Transaction = db.transaction;

function initial() {
  User.create({
    username: "akuntest",
    password: bcrypt.hashSync("Test Password"),
  });
  Transaction.create({
    amount: 5000,
    notes: "Ini notes",
    date: new Date(),
    type: "income",
    userId: 1,
  });
  Transaction.create({
    amount: 10000,
    notes: "Ini transaksi 2",
    date: new Date().setDate(new Date().getDate() + 2),
    type: "expense",
    userId: 1,
  });
  Transaction.create({
    amount: 15000,
    notes: "Ini transaksi 3",
    date: new Date().setDate(new Date().getDate() + 4),
    type: "expense",
    userId: 1,
  });
}

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Db");
//   initial();
// });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
