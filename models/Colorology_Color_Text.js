import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Colorology_Color_Text',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      colorology_checklist_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      basic_color_upper_body_text_1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      basic_color_upper_body_text_2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      basic_color_upper_body_text_3: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      basic_color_lower_body_text_1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      basic_color_lower_body_text_2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      basic_color_lower_body_text_3: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bright_color_upper_body_text_1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bright_color_upper_body_text_2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bright_color_lower_body_text_1: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bright_color_lower_body_text_2: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'colorology_color_text', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
