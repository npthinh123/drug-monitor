
const e = require('express');
let Drugdb = require('../model/model');



// creates and saves a new drug
exports.create = (req,res)=>{
    // Nếu middleware validation trả về lỗi, nó sẽ trả về res.status(400).json({ errors })
    // Ta kiểm tra nếu là lỗi validation thì render lại trang với errors
    if (res.statusCode === 400 && res.get('Content-Type') === 'application/json' && req.body && req.body.errors) {
        return res.status(400).render('add_drug', { errors: req.body.errors });
    }

    if(!req.body){// if content of request (form data) is empty
        return res.status(400).render('add_drug', { errors: ["Content cannot be empty!"] });
    }

    //create new drug
    const drug = new Drugdb({
        name : req.body.name,//take values from form and assign to schema
        card : req.body.card,
        pack: req.body.pack,
        perDay : req.body.perDay,
        dosage : req.body.dosage
    })

    //save created drug to database
    drug
        .save(drug)
        .then(data => {
            console.log(`${data.name} added to the database`);
            req.headers.accept && req.headers.accept.includes('text/html')
                ? res.redirect('/manage')
                : res.status(201).json({
                    message: "Drug added successfully!",
                    createdrug: data
                });
        })  
        .catch(err => {
            res.status(500).render('add_drug', {
                errors: [err.message || "There was an error while adding the drug"]
            });
        });

}


// can either retrieve all drugs from the database or retrieve a single user
exports.find = (req,res)=>{

    if(req.query.id){//if we are searching for drug using its ID
        const id = req.query.id;

        Drugdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Can't find drug with id: "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Error retrieving drug with id: " + id})
            })

    }else{
        Drugdb.find()
            .then(drug => {
                res.send(drug)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "An error occurred while retriving drug information" })
            })
    }
}


// edits a drug selected using its  ID

exports.update = (req,res)=>{
    // Nếu req.body là object rỗng hoặc undefined
    if (!req.body || (typeof req.body === 'object' && Object.keys(req.body).length === 0)) {
        return res.status(400).send({ message: "Cannot update an empty drug. Make sure to set 'Content-Type: application/json' and send a valid JSON body." });
    }

    const id = req.params.id;
    // new: true để trả về dữ liệu đã cập nhật
    Drugdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Drug with id: ${id} cannot be updated` });
            } else {
                res.send({
                    message: "Drug updated successfully!",
                    updatedDrug: data
                });
            }
        })
        .catch(err => {
            res.status(500).send({ message: err.message || "Error in updating drug information" });
        });

}

// deletes a drug using its drug ID
exports.delete = (req,res)=>{
    const id = req.params.id;

    Drugdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete drug with id: ${id}. Pls check id`})
            }else{
                res.send({
                    message : `${data.name} was deleted successfully!`
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete Drug with id=" + id
            });
        });

}