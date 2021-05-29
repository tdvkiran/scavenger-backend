const bcrypt = require('bcrypt')
const readXlsxFile = require('read-excel-file/node')

const { Branch } = require('../models/huntModel');
const { MongoBulkWriteError } = require('mongodb');


const importDataFromXLSX = async (req, res) => {
    try {
        await readXlsxFile(req.file.path)
            .then(async rows => {
                rows.shift();

                const docs = [];
                for (let row of rows) {
                    //console.log(row)
                    if (row[0] == null) {
                        break;
                    }
                    let newBranch = new Branch({
                        insitutionName: row[0],
                        branchName: row[1],
                        address: row[2],
                        city: row[3],
                        contactNumber: typeof (row[4]) == 'string' ? row[4].split(', ') : row[4],
                        branchIncharge: row[5],
                        pincode: typeof (row[6]) == 'string' ? row[6].split(', ') : row[6]
                    });
                    const branches = await Branch.findOne({ branchName: newBranch.branchName });
                    //console.log(branches)
                    if (branches != null) {
                        throw new MongoBulkWriteError('branch already exists ' + newBranch.branchName)
                    }
                    newBranch.password = await bcrypt.hash(row[1] + 'pwd', 8);
                    docs.push(newBranch);
                }

                const options = { ordered: true };
                const result = await Branch.insertMany(docs, options);
                res.send(result);
            })
            .catch(err => {
                if (err.name == 'BulkWriteError')
                    res.status(409).send('branch data already exists');
                else
                    res.status(500).send(err.name)
            })
    }
    catch (err) {
        res.send(500).json({ err })
    }
}


const createNewBranch = async (req, res) => {
    let newBranch = new Branch(req.body);
    const branches = await Branch.find({ branchName: newBranch.branchName });
    if (branches.length == 0) {
        newBranch.password = await bcrypt.hash(req.body.password, 8);
        newBranch.save((err, branch) => {
            if (err) {
                res.send(err);
                return;
            }
            res.json(branch);
        })
    }
    res.send('branch already registered');
}

const getBranches = async (req, res) => {
    try {
        let pincode = req.params.id;
        const branches = await Branch.find({ pincode: pincode });
        if (branches.length == 0) {
            res.status(404).send('No branches found in your area');
            return;
        }
        res.send(branches);
    }
    catch (err) {
        res.status(500).send(err);
    }
}

module.exports = {
    getBranches,
    importDataFromXLSX,
    createNewBranch
}