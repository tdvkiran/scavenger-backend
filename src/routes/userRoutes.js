
const auth = require('../middleware/auth');
const {login, logout} = require('../controllers/userController')

const routes= (app)=>{


 app.route('/users/login')
 .post(login)

app.route('/users/logout')
.post(auth, logout)
}

module.exports = routes;