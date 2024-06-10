import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Colorology_Checklist',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      judge: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      basic_color_upper_body_1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      basic_color_upper_body_2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      basic_color_upper_body_3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      basic_color_lower_body_1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      basic_color_lower_body_2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      basic_color_lower_body_3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bright_color_upper_body_1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bright_color_upper_body_2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bright_color_lower_body_1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bright_color_lower_body_2: {
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
      text3_1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      text3_2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      text3_3: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'colorology_checklist', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
