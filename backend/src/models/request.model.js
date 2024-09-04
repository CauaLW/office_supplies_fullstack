const { DataTypes, Model } = require("sequelize");
const db = require("../db");

class RequestModel extends Model {
    async approveRequest() {
        this.set('approved', true)
        await this.save({
            fields: ['approved'],
        })
    }

    async rejectRequest(observations) {
        this.set('approved', false)
        this.set('observations', observations)
        await this.save({
            fields: ['approved', 'observations'],
        })
    }
}

RequestModel.init(
    {
        id: {
            primaryKey: true,
            type: DataTypes.INTEGER,
            field: 'id',
            unique: true,
            allowNull: false,
            autoIncrement: true,
        },
        applicantName: {
            type: DataTypes.STRING(150),
            field: 'applicant_name',
            allowNull: false,
        },
        itemPrice: {
            type: DataTypes.INTEGER,
            field: 'item_price',
            allowNull: false,
        },
        itemDescription: {
            type: DataTypes.STRING(150),
            field: 'item_description',
            allowNull: false,
        },
        approved: {
            type: DataTypes.BOOLEAN,
            field: 'approved',
            allowNull: true,
            defaultValue: null,
        },
        observations: {
            type: DataTypes.STRING(300),
            field: 'observations',
            allowNull: true,
            defaultValue: null,
        }
    },
    {
        sequelize: db,
        tableName: 'Request',
        modelName: 'Request',
    }
)

module.exports = RequestModel