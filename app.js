const mysql2 = require("mysql2");
const express = require("express");
const app = express();

const connection = mysql2.createConnection({
    host: "localhost",
    user: "root",
    database: "chatbottests",
    password: ''
});

connection.connect(function(err){
    if(err){
        return console.error("Ошибка: " + err.message);
    }
    else{
        console.log("Подключение к серверу установленно");
    }
});

app.get("/", function(_, response){
    response.send("<h1>Hello, world</h1>");
});

app.get("/getAllItems", function(_, response){
    connection.query("select * from items", function(err, results){
        if(err) response.json(null);
        else response.json(results);
    });
});

app.get("/addItem", function(request, response){
    const name = request.query.name;
    const desc = request.query.desc;
    if(name == null || desc == null){
        response.json(null);
    }
    else{
        connection.query("insert into items(name, description) values(?, ?)", [name, desc], 
        function(err){
            if(err) response.json(null);
            else{
                connection.query("select * from items", function(err, results){
                    if(err) response.send(null);
                    else response.json(results);
                });
            }
        });
    }
});

app.get("/deleteItem", function(request, response){
    const id = request.query.id;
    if(id == null || Number.isNaN(parseInt(id))){
        response.json(null);
    }
    else{
        connection.query("delete from items where items.id=?", [parseInt(id)], 
        function(err){
            connection.query("select * from items", function(err, results){
                if(err) response.send(null);
                else response.json(results);
            });
        });
    }
});

app.get("/updateItem", function(request, response){
    const id = request.query.id;
    const name = request.query.name;
    const desc = request.query.desc;
    if(id == null || Number.isNaN(parseInt(id)) || 
    name == null || desc == null){
        response.json(null);
    }
    else{
        connection.query("update items set name=?, description=? where id=?", [name, desc, parseInt(id)],
        function(err){
            if(err) response.json(null);
            else{
                connection.query("select * from items", function(err, results){
                    if(err) response.send(null);
                    else response.json(results);
                });
            }
        });
    }
});

app.listen(3000);