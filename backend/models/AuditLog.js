const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.ENUM('LOGIN_SUCCESS', 'LOGIN_FAILED', 'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_COMPLETE', 'PASSWORD_CHANGE', '2FA_VERIFY_SUCCESS', '2FA_VERIFY_FAILED', 'LOGOUT'),
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  details: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});

module.exports = AuditLog;