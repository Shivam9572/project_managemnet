const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProjectMember = sequelize.define(
  "projectmembers",
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
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "userid"
    },
    role: {
      type: DataTypes.ENUM("admin", "member"),
      allowNull: false,
      defaultValue: "member"
    }
  },
  {
    indexes: [
      { unique: true, fields: ["projectid", "userid"] },
      { fields: ["userid"] }
    ]
  }
);

module.exports = ProjectMember;
