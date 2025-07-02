import { Model, Sequelize } from "sequelize";
import sequelize from '../../seq.js';

class Book extends Model {}

Book.init({
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false, 
    autoIncrement: true,
  },
  title: {
    type: Sequelize.DataTypes.STRING(255), 
    allowNull: false 
  },
  author: {
    type: Sequelize.DataTypes.STRING(255), 
    allowNull: true 
  },
  description: {
    type: Sequelize.DataTypes.TEXT, 
    allowNull: true 
  },
  published_year: {
    type: Sequelize.DataTypes.INTEGER, 
    allowNull: true 
  }
}, {
  sequelize, 
  modelName: 'Book', 
  tableName: 'books', 
  timestamps: false 
});

class BookCover extends Model {}

BookCover.init({
  id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true, 
  },
  book_id: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true, 
  },
  file_path: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false, 
  },
  uploaded_at: {
      type: Sequelize.DataTypes.DATE, 
      allowNull: true, 
      defaultValue: Sequelize.DataTypes.NOW, 
  },
  }, {
    sequelize,
    modelName: 'BookCover', 
    tableName: 'covers', 
    timestamps: false 
  },
);

Book.hasMany(BookCover, {
  foreignKey: 'book_id', 
  sourceKey: 'id',      
  as: 'covers',          
  onDelete: 'CASCADE', 
});

BookCover.belongsTo(Book, {
  foreignKey: 'book_id',
  targetKey: 'id',      
  as: 'book',           
});

export default { Book, BookCover }