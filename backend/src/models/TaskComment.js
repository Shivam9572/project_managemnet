const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TaskComment = sequelize.define(
  "taskcomments",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    taskId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "taskid"
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "userid"
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    indexes: [{ fields: ["taskid"] }, { fields: ["userid"] }]
  }
);

module.exports = TaskComment;
