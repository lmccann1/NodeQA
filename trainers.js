var HTTP = require('http');
var mysql = require("mysql");
var QS = require("querystring");
var url = require("url");
var fs = require("fs");

var server = HTTP.createServer(function(request, response ) {

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "qa"
    });
    con.connect(function (E) {
        if (E) {
            console.log(E);
        }
    });

    var pathname = url.parse(request.url, true).pathname;
    if(pathname == "/"){
        con.query("SELECT * FROM trainers", function(E, result) {
            var pathname = url.parse(request.url, true).pathname;
            if (pathname == "/") {
                response.write("<h1>ALL TRAINERS</h1>");
                response.write("<a href='http://localhost:4000/addskill'>Add Skills || </a>");
                response.write("<a href='http://localhost:4000/addtrainer'>Add Trainer || </a>");
                response.write("<a href='http://localhost:4000/addSubject'>Add Subject</a>");
                response.write("<br>");
                con.query("SELECT * FROM trainers", function (E, result) {
                    if (E) {
                        console.log(E);
                    }
                    else {

                            result.forEach(function (record) {
                            //console.log(record);
                            response.write("<br>");
                            response.write(record.Trainer_id.toString());
                            response.write("<br>");
                            response.write(record.Firstname);
                            response.write("<br>");
                            response.write(record.Email);
                            response.write("<br>");
                            response.write(record.Mobile);
                            response.write("<br>");
                            response.write(record.Address);
                            response.write("<br>");
                            response.write(`<a href='http://localhost:4000/deltrainer?id=${record.Trainer_id}'>delete</a>`);
                            response.write(`<a href='http://localhost:4000/edittrainer?id=${record.Trainer_id}'>edit</a>`);
                            response.write("<br>");

                        });
                    }
                    response.end();
                });
            }
        });
    }
    if (pathname == "/addskill") {
        response.write("<a href='http://localhost:4000/'>Home</a>");
        fs.readFile("./addskill.html", function (error, data) {
            if (error) {
                console.log("add a user error");
            }
            else{
                //response.send(data);
                response.write(data);
            }
            response.end();

        });
    }
    if(pathname == "/processedform"){
        var data="";
        console.log("success");
        request.on("data", function(d){
            data += d;
        });
        request.on("end", function(){
            var Form = QS.parse(data);
            var insertQuery= `insert into trainer_skills values('${Form.tid}', '${Form.sid}','${Form.sl}')`
            con.query(insertQuery);
            console.log(data);
            console.log(Form);

        });

    }
   if (pathname == "/addtrainer") {
        response.write("<a href='http://localhost:4000/'>Home</a>");
        fs.readFile("./addtrainer.html", function (error, data) {
            if (error) {
                console.log("add a user error");
            }
            else{
                //response.send(data);
                response.write(data);

            }
            response.end();

        });

    }
  if(pathname == "/processedform2"){
        var data="";
        console.log("success");
        request.on("data", function(d){
            data += d;
        });
        request.on("end", function(){
            var Form = QS.parse(data);
            var insertQuery= `insert into trainers values('${Form.Trainer_id}', '${Form.Firstname}','${Form.Email}','${Form.Mobile}','${Form.Address}')`
            con.query(insertQuery);
            console.log(data);
            console.log(Form);

        });
    }
    if(pathname == "/addSubject") {
        response.write("<a href='http://localhost:4000/'>Home</a>");
         fs.readFile("./addSubject.html", function (error, data) {
                if (error) {
                    console.log("cant find page");

                }
                else {
                    response.write(data);
                }
             response.end();
            });
        }
        if (pathname == "/processedform3") {
            var data = "";
            console.log("successfull");
            request.on("data", function (d) {
                data += d;

            });
            request.on("end", function () {
                var Sub = QS.parse(data);
                var insertQuery = `insert into subject values('${Sub.sid}','${Sub.subj}')`
                con.query(insertQuery);

            });
        }
        if(pathname == "/deltrainer"){
            var tid = url.parse(request.url, true).query.id
            var deleteQuery = `delete from trainers where Trainer_id = ${tid}`;
            con.query(deleteQuery, function(E){
                if(E){
                    console.log("error");
                }
                response.end();
            });


        }
});
server.listen(4000);

