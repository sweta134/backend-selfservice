
var express = require('express');
var mysql = require('mysql');
var app = express();
var request = require("request");
var cors = require('cors');


var masterModel = require("./masterModel");
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'selfservice',
  insecureAuth: true,
});




connection.connect(function (error) {
  console.log(error);
  if (error) {
    console.log('Error in connection');
  } else {

  }
});


// verifying student

app.post('/verifystudent/', function (req, resp) {

  masterModel.get_student(connection, req.body.studentid, function (err, result) {
    console.log(result);
    if ((result.length) == 1) {
      var responseData = {
        status: 'success',
        data: true,
        message: 'Student Verified Successfully'
      }
       //console.log(responseData);

      //resp.send(otp);
      //if((responseData.data.length)==1){
      var otp = (Math.floor(Math.random() * (9999 - 1000) + 1000));
      masterModel.add_studentotp(connection, req.body.studentid, otp, function (err, resultOtp, resultStudent) {

        // SEND SMS
        var smsstring = "http://support.riceindia.org/login/send_otp?mobile=" + resultStudent[0].contactNo + "&otp=" + resultOtp

        request.get(smsstring, function (error, response, body) {
          if (error) {
            console.log(error);
          } else {
            console.log(response);
          }
        });

      });

      resp.send(JSON.stringify(responseData))
    }
    //} 
    else {
      //console.log(result);
      var responseData = {
        status: 'failure',
        data: false,
        message: 'Student Not Veified'
      }
      resp.send(JSON.stringify(responseData))
      
    }
    

  });

})

// verification of OTP

app.post('/verify-otp', function (req, res) {



  masterModel.get_otp(connection, req.body.studentid, req.body.otp, function (err, result) {

    var responseData = {
      status: 'success',
      data: true,
      message: 'OTP Veified'
    }

    if (result.length == 1) {
      res.send(JSON.stringify(responseData))
      masterModel.update_otp(connection, req.body.studentid, req.body.otp, function (err, result) {
        if (err) {
          console.log(error);
        } else {
          console.log(responseData);
        }
      })
    } else {
      var responseData = {
        status: 'failure',
        data: 'false',
        message: 'OTP not matched'
      }
      res.send(JSON.stringify(responseData))
    }




  });

  // masterModel.update_session(connection, req.body.otp, function (err, result) {

  //   var responseData = {
  //     status: 'success',
  //     data: true,
  //     message: 'SESSION EXPIRED'
  //   }

  //   if (result.length == 1) {
  //     res.send(JSON.stringify(responseData))
  //     masterModel.update_otp(connection, req.body.otp, function (err, result) {
  //       if (err) {
  //         console.log(error);
  //       } else {
  //         console.log(responseData);

  //       }
  //     })
  //   } else {
  //     var responseData = {
  //       status: 'failure',
  //       data: 'false',
  //       message: 'OTP not matched'
  //     }
  //     res.send(JSON.stringify(responseData))
  //   }




  // });

})

app.post('/view_transaction_history/', function (req, resp) {

  masterModel.get_transaction(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err){
      console.log(err);
    }
    else{
      var responseData = {
      //requestUrl: req.originalUrl,
      status: 'success',
      data: result,
    }
    //   console.log(responseData);
    resp.send(responseData);
  }

  });


});

app.post('/view_total_commitment/', function (req, resp) {

  masterModel.get_commitment(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err){
      console.log(err);
    }
    else{
    var responseData = {
      //requestUrl: req.originalUrl,
      data: result,
    }
    //   console.log(responseData);
    resp.send(responseData);
  }

  });

  app.post('/view_total_paid_amount/', function (req, resp) {

    masterModel.get_paidAmount(connection, req.body.studentid, function (err, result) {
      //console.log(result);
      if (err){
        console.log(err);
      }
      else{
      var responseData = {
        //requestUrl: req.originalUrl,
        data: result,
      }
      //   console.log(responseData);
      resp.send(responseData);
    }
  
    });

    

  


});

})

app.post('/current_dues/', function (req, resp) {

  masterModel.get_current_dues(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err){
      console.log(err);
    }
    else{
    var responseData = {
      //requestUrl: req.originalUrl,
      data: result,
    }
    //   console.log(responseData);
    resp.send(responseData);
  }

  });
});

app.post('/upcoming_dues/', function (req, resp) {

  masterModel.get_upcoming_dues(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err){
      console.log(err);
    }
    else{
    var responseData = {
      //requestUrl: req.originalUrl,
      data: result,
    }
    //   console.log(responseData);
    resp.send(responseData);
  }

  });
});

app.post('/previous_dues/', function (req, resp) {

  masterModel.get_previous_dues(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err){
      console.log(err);
    }
    else{
    var responseData = {
      //requestUrl: req.originalUrl,
      data: result,
    }
    //   console.log(responseData);
    resp.send(responseData);
  }

  });
});




app.listen(4000);