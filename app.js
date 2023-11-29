const express = require("express");
const app = express();
app.get("/", function(_, response){
    response.send("<h1>Hello, world!</h1>");
});

app.use("/static", function(_, response){
    response.json('{header: "Hello", body: "Octagon NodeJS Test"}');
});

app.use("/dynamic", function(request, response){
    const a = request.query.a;
    const b = request.query.b;
    const c = request.query.c;
    if(a == null || b == null || c == null || 
        Number.isNaN(parseInt(a)) || 
        Number.isNaN(parseInt(b)) ||
        Number.isNaN(parseInt(c))) {
        response.json('{header: "Error"}');
    }
    else{
        response.json(`{header: "Calculated", body: "${(parseInt(a)+parseInt(b)+parseInt(c))/3}"}`);
    }
});

app.listen(3000);