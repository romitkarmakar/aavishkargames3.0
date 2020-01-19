require("dotenv").config();
var Sequelize = require("sequelize"),
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    port: 5432,
    host: "ec2-34-197-171-33.compute-1.amazonaws.com",
    dialectOptions: {
      ssl: true
    },
    logging: false
  });

var Profile = sequelize.define("Profiles", {
  email: Sequelize.STRING
});

const create = (em) => {
  sequelize.sync().then(function() {
    return Profile.findOrCreate({
      where: { email: em }
    }).spread(function(user, created) {
      console.log(
        user.get({
          plain: true
        })
      );
      console.log(created);
    });
  });
}

module.exports = create;
