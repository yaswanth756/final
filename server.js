var express=require("express");
var bodyparser=require("body-parser");
var path=require("path");
const mongoose =require("mongoose");
var app=express();
app.use(express.static(__dirname));
app.use(bodyparser.json());
const port=3000;
// schema
// connection

//-------------------mysql database connection>
require('dotenv').config();
const mysql=require("mysql");
const db = mysql.createConnection({
    host:'bbm7sqkbecqsgvdiopj7-mysql.services.clever-cloud.com', // Ensure this is your actual database hostname from Render
    user: "uc0pbkn6ud8bi0mu",               // Replace with actual MySQL username
    password:  "0VUI2zprtAD7e1x5TIDS",       // Replace with actual MySQL password
    database: "bbm7sqkbecqsgvdiopj7",     // Replace with actual database name
    port: 3306                          // Default MySQL port
});


db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");

    // Create the `todos` table if it doesn't exist
 

   
});

db.query("SELECT * FROM todos",(err,result)=>{
    console.log(result);
});

//--------------------------------mysql database connection START>
//--------------------------------PAGE load>
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

//--------------------------------todo get load>
app.get("/api/todolist",(req,res)=>{
    db.query("SELECT * from todos order by id DESC",(err,result)=>{
        if(result.length===0){
            res.json({message:"Your to-do list is empty! 🍃 Let's get productive and add your first task!"});
        }else{
            
            res.json(result);
        }
    })
});



//--------------------------------post load>
app.post("/api/todolist",(req,res)=>{
    var {name, description,date}=req.body;
    var sql="insert into todos (name,description,date) VALUES (?,?,?)";
    db.query(sql,[name,description,date],(err,result)=>{
        if(err){
            res.status(500).json({message:err.message});
        }
        else{
            res.status(200).json({message:"todo added successfully"});
        }
    });
})

//--------------------------------updateload>
app.put('/api/todolist/:id',(req,res)=>{
    const todoId=req.params.id;
    console.log(todoId);
    var {status}=req.body;
    var sql="update todos SET status=? where id=?";
    db.query(sql,[status,todoId],(err,result)=>{
        if(err){
            res.status(500).json({error:err.message});

        }else{
            res.status(200).json({message: "Todo updated successfully"});
        }
    });
})

app.delete('/api/todolist/:id', (req, res) => {
    const todoId = req.params.id;

    // SQL query to delete the todo
    const sql = "DELETE FROM todos WHERE id = ?";
    db.query(sql, [todoId], (err, result) => {
        if (err) {
            console.log(err);  // Log the error on the server side
            res.status(500).json({ error: err.message });
        } else {
            if (result.affectedRows === 0) {  // Check if the row exists
                return res.status(404).json({ message: "Todo not found" });
            }
            res.status(200).json({ message: "Todo deleted successfully" });
        }
    });
});

//--------------------------------listen>
app.listen(port,()=>{
    console.log("good sucess bro!");
}); 
