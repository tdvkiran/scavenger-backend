const upload = require('../middleware/upload');
const {importDataFromXLSX,createNewBranch, getBranches} = require('../controllers/huntController')


const routes= (app)=>{
    app.route('/upload/xlsx')
    .post(upload.single("file"), importDataFromXLSX);

    app.route('/branch/new')
    .post(createNewBranch);


    app.route('/branches/:id')
    .get(getBranches)
}

//export default routes;
module.exports = routes;