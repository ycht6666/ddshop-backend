import { DataTypes } from 'sequelize'

export default async function (sequelize) {
  return sequelize.define(
    'Coupon_Send_Management',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      coupon_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      coupon_name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      usage_status: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      usage_time: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      send_time: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'coupon_send_management', //直接提供資料表名稱
      timestamps: true, // 使用時間戳
      paranoid: false, // 軟性刪除
      underscored: true, // 所有自動建立欄位，使用snake_case命名
      createdAt: 'created_at', // 建立的時間戳
      updatedAt: 'updated_at', // 更新的時間戳
    }
  )
}
