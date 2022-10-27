const { auth } = require("../middleware");
const controller = require("../controllers/transaction.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //OPTIONAL params: 
  //type: valuenya income/expense untuk filter
  //page: valuenya berupa angka nomor halaman yang ingin ditampilkan (mulai dari 1) 
  //size: valuenya berupa jumlah data yang ingin ditampilkan per halamannya
  //minAmount: valuenya berupa angka amount minimal yang ingin difilter ( value >= minAmount)
  //maxAmount: valuenya berupa angka amount maximal yang ingin difilter ( value <= maxAmount)
  //sortBy: valuenya berupa "date" atau "amount"
  //sortType: valuenya berupa "DESC"/"desc" dan "ASC"/"asc"
  app.get("/transactions", auth.verifyToken, controller.getTransactions);

  app.get("/transactions/:id", auth.verifyToken, controller.getTransactionById);

  app.post("/transactions/", auth.verifyToken, controller.postTransaction);

  app.patch("/transactions/:id",  auth.verifyToken, controller.updateTransaction);

  app.delete("/transactions/:id", auth.verifyToken, controller.deleteTransaction);
};