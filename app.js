const mysql = require("mysql2")
const express = require("express");
const app = express();

const connection = mysql.createConnection({
    host: "localhost",
    user: "noflower",
    database: "chatbottests",
    password: "Em#cdRFUPz-meH6"
});

connection.connect(function(err){
    if(err){
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу MySQL успешно установленно");
    }
});

app.get("/", function(_, response){
    response.send("<h1>Hello, World</h1>");
});

app.use("/getAllItems", function(_, response){
    connection.query("select * from items", function(err, results){
        if(err) response.send(null);
        else response.json(results);    
    });
});

app.use("/addItem", function(request, response){
    const name = request.query.name;
    const desc = request.query.desc;
    if(name==null || desc==null){
        response.send(null);
    }
    else{
        connection.query("insert into items(name, description) values(?, ?)",
        [name, desc], function(err, results) {
            if(err) response.send(null);
            else{
                connection.query("select * from items", function(_, results){
                    response.json(results);
                });
            }
        });
    }
});

app.get("/deleteItem", function(request, response){
    const id = request.query.id;
    if(id==null || Number.isNaN(parseInt(id))){
        response.send(null);
    }
    else{
        connection.query("DELETE FROM items WHERE items.id = ?", [id], function(err, results){
            if(err) response.send(null);
            else{
                connection.query("select * from items", function(err, results){
                    if(err) response.json([]);
                    else response.send(results);
                });
            }
        });
    }
});

app.get("/updateItem", function(request, response){
    const id = request.query.id;
    const name = request.query.name;
    const desc = request.query.desc;
    if(id==null || Number.isNaN(parseInt(id)) || name==null || desc==null){
        response.send(null);
    }
    else{
        connection.query("update items set name=?, description=? where id=?", [name, desc, parseInt(id)], function(err){
            if(err) response.send(null);
            else{
                connection.query("select * from items", function(err, results){
                    if(err) response.send(err);
                    else response.send(results);
                });
            }
        });
    }
});

app.listen(3000);