const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define(
  "tasks",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "projectid"
    },
    assignedTo: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: "assignedto"
    },
    title: {
      type: DataTypes.STRING(180),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("todo", "in_progress", "done"),
      allowNull: false,
      defaultValue: "todo"
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "urgent"),
      allowNull: false,
      defaultValue: "medium"
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "duedate"
    }
  },
  {
    indexes: [
      { fields: ["projectid"] },
      { fields: ["assignedto"] },
      { fields: ["status"] },
      { fields: ["duedate"] }
    ]
  }
);

module.exports = Task;
