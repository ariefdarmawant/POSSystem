const db = require("../models");
const Transaction = db.transaction;
const User = db.user;

const { HTTP_STATUS } = require("../constants");
const { Op } = require("sequelize");

const getPaginationValue = (page, size) => {
  //default tampilin 5 data transaksi pada 1 halaman
  const limit = size ? +size : 5;
  //default mulai dari halaman 1
  const offset = page - 1 ? (page - 1) * limit : 0;

  return { limit, offset };
};

const getPaginationObj = (res, page, limit) => {
  const { count: total, rows: transactions } = res;
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(total / limit);

  return { total, transactions, currentPage, totalPages };
};

exports.getTransactions = async ({ query }, res) => {
  const type = query.type || undefined;
  const page = query.page || undefined;
  const size = query.size || undefined;
  const maxAmount = query.maxAmount || undefined;
  const minAmount = query.minAmount || 0;
  const sortBy = query.sortBy || undefined;
  const sortType = query.sortType || "DESC";

  //bikin kondisi untuk where sesuai ada tidaknya filter type dan amount
  let whereQuery = {};
  if (type) {
    whereQuery = { type };
  }
  if (maxAmount || minAmount) {
    whereQuery = {
      ...whereQuery,
      amount: {
        [Op.and]: {
          ...(minAmount && { [Op.gte]: minAmount }),
          ...(maxAmount && { [Op.lte]: maxAmount }),
        },
      },
    };
  }

  let orderArr = [];
  if (sortBy) {
    orderArr = [
      [sortBy === "amount" ? "amount": "date", sortType.toUpperCase() === "DESC" ? "DESC" : "ASC"],
    ];
  }

  if(page < 1 || size < 1){
    res.status(HTTP_STATUS.BAD_REQUEST).send({
      message: `Invalid pagination value [page:${page},size:${size}]`
    })
    return
  }

  //ambil value limit dan offset untuk filter pada db
  const { limit, offset } = getPaginationValue(page, size);

  Transaction.findAndCountAll({
    where: whereQuery,
    include: { model: User, attributes: ["username"], as: "createdBy" },
    limit,
    offset,
    order: orderArr,
  })
    .then((result) => {
      result
        ? res.status(HTTP_STATUS.OK).send({
            message: "Transactions fetched sucessfully!",
            ...getPaginationObj(result, page, limit),
          })
        : res.status(HTTP_STATUS.NO_CONTENT).send();
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

exports.getTransactionById = async (req, res) => {
  const [transactionData] = await Transaction.findAll({
    include: { model: User, attributes: ["username"], as: "createdBy" },
    where: {
      id: req.params.id,
    },
  });
  transactionData
    ? res
        .status(HTTP_STATUS.OK)
        .send({ message: "Transaction fetched.", data: transactionData })
    : res.status(HTTP_STATUS.NO_CONTENT).send();
};

exports.updateTransaction = (req, res) => {
  const newAmount = req.body.amount || undefined;
  const newNotes = req.body.notes || undefined;
  const newDate = req.body.date || undefined;
  const newType = req.body.type || undefined;
  const updateObj = {
    ...(newAmount && { amount: newAmount }),
    ...(newNotes && { notes: newNotes }),
    ...(newDate && { date: newDate }),
    ...(newType && { type: newType }),
  };
  Transaction.update(updateObj, { where: { id: req.params.id } })
    .then(([found]) => {
      found
        ? res.status(HTTP_STATUS.OK).send({
            message: "Transaction updated.",
          })
        : res.status(HTTP_STATUS.NO_CONTENT).send();
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

exports.postTransaction = (req, res) => {
  Transaction.create({
    amount: req.body.amount,
    notes: req.body.notes,
    date: req.body.date,
    type: req.body.type,
    userId: req.body.userId,
  })
    .then((dataPosted) => {
      res
        .status(HTTP_STATUS.OK)
        .send({ message: "Transaction posted sucessfully!", data: dataPosted });
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

exports.deleteTransaction = async (req, res) => {
  Transaction.destroy({ where: { id: req.params.id } })
    .then((found) => {
      found
        ? res
            .status(HTTP_STATUS.OK)
            .send({ message: `Transaction with id ${req.params.id} deleted.` })
        : res.status(HTTP_STATUS.NO_CONTENT).send();
    })
    .catch((err) => {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};
