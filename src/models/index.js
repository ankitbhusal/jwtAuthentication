// database connection with mysql using sequelize
import Sequelize from "sequelize";

export default new Sequelize("test_db", "root", "ankitbhusal20", {
  host: "127.0.0.1",
  dialect: "mysql",
});
