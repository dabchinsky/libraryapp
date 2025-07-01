import { Model, Sequelize } from "sequelize";

export const sequelize = new Sequelize('library', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
});

class Book extends Model {}

Book.init({
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false, // Соответствует "Not NULL?"
    autoIncrement: true,
  },
  title: {
    type: Sequelize.DataTypes.STRING(255), // character varying (255)
    allowNull: false // Соответствует "Not NULL?"
  },
  author: {
    type: Sequelize.DataTypes.STRING(255), // character varying (255)
    allowNull: true // Соответствует "Not NULL?" выключен
  },
  description: {
    type: Sequelize.DataTypes.TEXT, // text
    allowNull: true // Соответствует "Not NULL?" выключен
  },
  published_year: {
    type: Sequelize.DataTypes.INTEGER, // integer
    allowNull: true // Соответствует "Not NULL?" выключен
  }
}, {
  sequelize, // Экземпляр Sequelize
  modelName: 'Book', // Имя модели
  tableName: 'books', // Имя таблицы в базе данных (если отличается от имени модели в нижнем регистре во множественном числе)
  timestamps: false // Если у вас нет полей createdAt и updatedAt в таблице
});

class BookCover extends Model {}

BookCover.init({
  id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true, // Соответствует nextval('books_files_id_seq'::regclass)
  },
  book_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true, 
  },
  file_path: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false, // "Not NULL?" включен
  },
  uploaded_at: {
      type: Sequelize.DataTypes.DATE, // timestamp without time zone
      allowNull: true, // "Not NULL?" выключен
      defaultValue: Sequelize.DataTypes.NOW, // CURRENT_TIMESTAMP
  },
  }, {
    sequelize,
    modelName: 'BookCover', // Имя модели
    tableName: 'covers', // Имя таблицы в БД
    timestamps: false // У вас нет колонок createdAt/updatedAt
  },
);

Book.hasMany(BookCover, {
  foreignKey: 'book_id', // Имя колонки в BookFile, которая ссылается на Book
  sourceKey: 'id',      // Имя колонки в Book, на которую ссылается book_id
  as: 'covers',          // Псевдоним для доступа к связанным BookFile через Book
  onDelete: 'CASCADE',  // Опционально: что происходит при удалении родительской записи (Book)
                         // 'SET NULL', 'RESTRICT', 'NO ACTION', 'CASCADE'
});

// BookFile (много) принадлежит (belongsTo) Book (одному)
BookCover.belongsTo(Book, {
  foreignKey: 'book_id',
  targetKey: 'id',      // Имя колонки в Book, на которую ссылается book_id
  as: 'book',           // Псевдоним для доступа к связанной Book через BookFile
});

export default { Book, BookCover }