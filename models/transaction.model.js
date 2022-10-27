module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
      amount: {
        type: Sequelize.INTEGER
      },
      notes: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE
      },
      type:{
        type: Sequelize.ENUM("income","expense")
      }
    });
  
    return Transaction;
  };