'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Reaction.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        },
        onDelete: 'CASCADE'
      }),
        models.Reaction.belongsTo(models.Post, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
      });
    }
  }
  Reaction.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    type: {
      type: DataTypes.ENUM('like', 'love', 'wow', 'sad', 'angry'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Reaction',
  });
  return Reaction;
};
