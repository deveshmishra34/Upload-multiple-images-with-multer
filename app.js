const express = require("express");
const mysql = require("mysql");
const multer = require("multer");

const app = express();
app.use(express.static("public"));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, x-access-token, Content-Type, Accept");
    next();
});

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/uploads");
    },
    filename: function (req, file, callback) {
        // append file name + current date + extension
        callback(null, file.fieldname + "_" + Date.now() + "." + file.originalname.split('.')[1]);
    }
});

var upload = multer({ storage: Storage });

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'penpencil'
});

db.connect( (err) => {
    if(err) throw err;
    console.log("DB connected");
});

app.get("/", (req, res) => {
    res.send("You're at wrong place...");
});

app.post("/feedback", (req, res) => {
    console.log(req.body);

    let data = {
        name: "sdsd",
        email: "sdsd",
        subject: "sdsd",
        type: "ss",
        rating: "sdsd",
        description: "sdsdsd",
    }
    let sql = "INSERT INTO feedback SET ?";
    let query = db.query(sql, data, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// insert data
app.post("/insertData", upload.any("images"), (req, res) => {
    let images = [];
    req.files.forEach( (value) => {
        images.push(value.filename);
    });
    console.log(images);
    console.log(JSON.stringify(images));

    let data = {
        text : req.body.text,
        images: JSON.stringify(images)
    }
    let sql = "INSERT INTO businessmodule SET ?";

    let query = db.query(sql, data, (err, result) => {
        if(err) throw err;
        res.json("Row inserted");
        // console.log(result);
    });
});




// read data
// app.get("/readData", (req, res) => {
//     let sql = "SELECT * FROM businessmodule";

//     let query = db.query(sql, (err, result) => {
//         if(err) throw err;
//         res.json(result);
//         console.log(result)
//     });
// });

// read single row
// app.get("/readData/:id", (req, res) => {
//     let sql = `SELECT * FROM businessmodule WHERE id = ${req.params.id}`;

//     let query = db.query(sql, (err, result) => {
//         if (err) throw err;
//         res.json(result);
//         console.log(result)
//     });
// });

// update data
// app.get("/updateData/:id", (req, res) => {
//     let newText = "This is some new text";
//     let sql = `UPDATE businessmodule SET text = '${newText}' WHERE id= ${req.params.id}`;
//     let query = db.query(sql, (err, result) => {
//         if(err) throw err;
//         res.json(result);
//         console.log(result)
//     });
// });

// delete data
// app.get("/deleteData/:id", (req, res) => {
//     let sql = `DELETE FROM businessmodule WHERE id = ${req.params.id}`;

//     let query = db.query(sql, (err, result) => {
//         if(err) throw err;
//         res.json(result);
//         console.log(result);
//     });
// });

// app.post("/upload_file", (req, res) => {
//     upload(req, res, (err) => {
//         if(err) throw err;
//         console.log(req.files);
//         console.log(req.body);
//         res.json("File uploaded successfully");
//     });
// });

app.listen(3000, () => {
    console.log("Server listening at 3000...");
});