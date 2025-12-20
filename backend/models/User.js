const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  twoFactorSecret: {
    type: DataTypes.STRING,
    allowNull: true
  },
  twoFactorEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lockUntil: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

User.prototype.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

User.prototype.incLoginAttempts = async function() {
  if (this.lockUntil && this.lockUntil < new Date()) {
    return this.update({
      loginAttempts: 0,
      lockUntil: null
    });
  }
  
  const updates = { loginAttempts: this.loginAttempts + 1 };
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  }
  
  return this.update(updates);
};

module.exports = User;