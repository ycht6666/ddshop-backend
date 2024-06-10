import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Tarot_Checklist',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      text1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      text2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      products_id_1: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      products_name_1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      product_photos_id_1: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      product_photos_img_1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      products_url_1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      products_id_2: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      products_name_2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      product_photos_id_2: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      product_photos_img_2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      products_url_2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'tarot_checklist', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
