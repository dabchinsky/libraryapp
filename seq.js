import { Sequelize } from "sequelize";

const sequelize = new Sequelize('library', process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: 'postgres',
});

export default sequelize;
