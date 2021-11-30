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
  password: 'S1w2e3t4a@',
  database: 'ais',
  insecureAuth: true,
});



connection.connect(function (error) {
  console.log(error);
  if (error) {
    console.log('Error in connection');
  } else {

  }
});

/* Application Programming Interface(API) for the Verifaction of User and Displaying of the data in the Models  */
// /Verifying Student/ is to verify if the student exist in the Database and to send OTP(One Time Password).(line:47-95)
// /Verify OTP is to verify the OTP if the OTP(One Time Password) inserted by the user is correct or incorrect. (line:99-131)
// /get_dashboard_details/ returns 5 modules i.e., Current dues, Previous Dues, Upcoming Dues, Total Payments, Total Commitment at once.(line:623-643)
/*Application Programming Interface for all the Modules which are being displayed inside each modules i.e., the components*/
// /get_current_details/ returns the component of the all the dues in the current time which include previous dues.(line:538-621)
// /get_previous_details/ returns the component of the dues that in the prvious session which donot incluce current session.(line:370-452)
// /get_upcoming_details/ returns the component of the future dues that the user need to pay apart from previous and current due.(line:454-536)
// /view_transaction_history/ returns the all details of transaction which has been occur 'Failed' or 'Success' all are been mentioned.(line:133-153)*/


app.post('/verifystudent/', function (req, resp) {

  // console.log(req.body);
  masterModel.get_student(connection, req.body.studentid, function (err, result) {
    console.log(req.body);
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

    // console.log(req.body);
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

})

app.post('/view_transaction_history/', function (req, resp) {

  masterModel.get_transaction(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err) {
      console.log(err);
    }
    else {
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
    if (err) {
      console.log(err);
    }
    else {
      var responseData = {
        //requestUrl: req.originalUrl,
        data: result,
      }
      //   console.log(responseData);
      resp.send(JSON.stringify(responseData));
    }

  });
  
})

app.post('/view_total_paid_amount/', function (req, resp) {

    masterModel.get_paidAmount(connection, req.body.studentid, function (err, result) {
      //console.log(result);
      if (err) {
        console.log(err);
      }
      else {
        var responseData = {
          //requestUrl: req.originalUrl,
          data: result,
        }
        //   console.log(responseData);
        resp.send(responseData);
      }

    });
});

app.post('/get_current_due_detail_sum/', function (req, resp) {

  masterModel.get_current_due_detail_sum(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err) {
      console.log(err);
    }
    else {
      var responseData = {
        //requestUrl: req.originalUrl,
        data: result,
      }
      //   console.log(responseData);
      resp.send(JSON.stringify(responseData));
    }

  });
});

app.post('/get_current_due_detail/', function (req, resp) {

  console.log(req);
  masterModel.get_current_due_detail(connection, req.body.studentid, function (err, result) {
    console.log(result);
    if (err) {
      console.log(err);
    }
    else {
      var responseData = {
        //requestUrl: req.originalUrl,
        data: result,
      }
      //   console.log(responseData);
      resp.send(responseData);
    }

  });
});

app.post('/get_previous_due_detail_sum/', function (req, resp) {

  masterModel.get_previous_due_detail_sum(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err) {
      console.log(err);
    }
    else {
      var responseData = {
        //requestUrl: req.originalUrl,
        data: result,
      }
      //   console.log(responseData);
      resp.send(responseData);
    }

  });
});

app.post('/get_previous_due_detail/', function (req, resp) {

  masterModel.get_previous_due_detail(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err) {
      console.log(err);
    }
    else {
      var responseData = {
        //requestUrl: req.originalUrl,
        data: result,
      }
      //   console.log(responseData);
      resp.send(responseData);
    }

  });
});

app.post('/get_previous_due_detail_secondTable/', function (req, resp) {

  masterModel.get_previous_due_detail_secondTable(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err) {
      console.log(err);
    }
    else {
      var responseData = {
        //requestUrl: req.originalUrl,
        data: result,
      }
      //   console.log(responseData);
      resp.send(responseData);
    }

  });
});

// app.post('/get_invoice_no/', function (req, resp) {

//   masterModel.get_invoice_no(connection, req.body.studentid, function (err, result) {
//     //console.log(result);
//     if (err) {
//       console.log(err);
//     }
//     else {
//       var responseData = {
//         //requestUrl: req.originalUrl,
//         data: result,
//       }
//       //   console.log(responseData);
//       resp.send(responseData);
//     }

//   });
// });

app.post('/get_invoice_no/', function (req, resp) {

  masterModel.get_invoice_no(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    var arr,new_arr;
    if (err) {
      console.log(err);
    }
    else {
      var responseData = {
        //requestUrl: req.originalUrl,
        data: result,
      }
      // const rep=JSON.parse(responseData);
      // resp.send(responseData);
      // console.log(responseData.data[0]["FeeComponents"]);
      arr=responseData.data[0]["FeeComponents"];
      resp.JSON(responseData.data[1]["FeeComponents"]);
      // console.log(arr.slice(1, 15));
    }

  });
});
app.post('/upcoming_dues/', function (req, resp) {

  masterModel.get_upcoming_dues(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err) {
      console.log(err);
    }
    else {
      var responseData = {
        //requestUrl: req.originalUrl,
        data: result,
      }
      //   console.log(responseData);
      resp.send(responseData);
    }

  });
});

app.post('/get_Total_invoice_amount/', function (req, resp) {

  masterModel.get_Total_invoice_amount(connection, req.body.studentid, function (err, result) {
    //console.log(result);
    if (err) {
      console.log(err);
    }
    else {
      var responseData = {
        data: result,
      }
      //   console.log(responseData);
      resp.send(responseData);
    }

  });
});


app.post('/get_previous_details/', function (req, resp) {

  masterModel.get_previous_details(connection, req.body.studentid, function (err, result,result_session) {
    //console.log(result);
    var components=[];
    var payable_date = "";
    var invoice = new Array();
    var total_amt = 0;
    var invoice_no ="";
    var sum = 0;
    var result1 = parseInt(result.length);
    var p =0;


    for(let i=0; i<result1; i++){
     // console.log(result[i].invoice_no);
      
      if(invoice_no != result[i].invoice_no && i > 0){
        var responseData = {
          invoice_id: invoice_no,
          total_amount:sum,
          component_data: components,
          payable_date : payable_date          
        }

        invoice.push(responseData);
        components = new Array();
     
        sum=0;

        components.push(result[i]);
        sum += parseInt(result[i].amount);

        
        p = p+1;
      }
      else
      {
        components.push(result[i]);
        sum += parseInt(result[i].amount);


        
        if(i == result1-1){
          var responseData = {
            invoice_id: invoice_no,
            total_amount:sum,
            component_data: components,
            payable_date : payable_date,
          }
          invoice.push(responseData);
         
        }
      }

    
      invoice_no = result[i].invoice_no; 
      payable_date = result[i].payable_date; 
      total_amt = total_amt + parseInt(result[i].amount); 
    }

    if (err){
      console.log(err);
    }
    else{

      var responseArray = {
        total_due_amount: total_amt,
        academic_session: result_session,
        invoices: invoice,
      }
     // console.log(result_session[0].session_name);

    var responseData = {
      //requestUrl: req.originalUrl,
      data: responseArray,
    }

    resp.send(responseData);
  }

  });
});

app.post('/get_upcoming_details/', function (req, resp) {

  masterModel.get_upcoming_details(connection, req.body.studentid, function (err, result,result_session) {
    //console.log(result);
    var components=[];
    var payable_date = "";
    var invoice = new Array();
    var total_amt = 0;
    var invoice_no ="";
    var sum = 0;
    var result1 = parseInt(result.length);
    var p =0;


    for(let i=0; i<result1; i++){
     // console.log(result[i].invoice_no);
      
      if(invoice_no != result[i].invoice_no && i > 0){
        var responseData = {
          invoice_id: invoice_no,
          total_amount:sum,
          component_data: components,
          payable_date : payable_date          
        }

        invoice.push(responseData);
        components = new Array();
     
        sum=0;

        components.push(result[i]);
        sum += parseInt(result[i].amount);

        
        p = p+1;
      }
      else
      {
        components.push(result[i]);
        sum += parseInt(result[i].amount);


        
        if(i == result1-1){
          var responseData = {
            invoice_id: invoice_no,
            total_amount:sum,
            component_data: components,
            payable_date : payable_date,
          }
          invoice.push(responseData);
         
        }
      }

    
      invoice_no = result[i].invoice_no; 
      payable_date = result[i].payable_date; 
      total_amt = total_amt + parseInt(result[i].amount); 
    }

    if (err){
      console.log(err);
    }
    else{

      var responseArray = {
        total_due_amount: total_amt,
        academic_session: result_session,
        invoices: invoice,
      }
     // console.log(result_session[0].session_name);

    var responseData = {
      //requestUrl: req.originalUrl,
      data: responseArray,
    }

    resp.send(responseData);
  }

  });
});

app.post('/get_current_details/', function (req, resp) {

  masterModel.get_current_details(connection, req.body.studentid, function (err, result,result_session) {
    // console.log(req.body);
    var components=[];
    var payable_date="";
    var invoice = new Array();
    var total_amt = 0;
    var invoice_no ="";
    var sum = 0;
    var result1 = parseInt(result.length);
    var p =0;


    for(let i=0; i<result1; i++){
     // console.log(result[i].invoice_no);
      
      if(invoice_no != result[i].invoice_no && i > 0){
        var responseData = {
          invoice_id: invoice_no,
          total_amount:sum,
          component_data: components,
          payable_date : payable_date         
        }

        invoice.push(responseData);
        components = new Array();
     
        sum=0;

        components.push(result[i]);
        sum += parseInt(result[i].amount);

        
        p = p+1;
      }
      else
      {
        components.push(result[i]);
        sum += parseInt(result[i].amount);


        
        if(i == result1-1){
          var responseData = {
            invoice_id: invoice_no,
            total_amount:sum,
            component_data: components,
            payable_date : payable_date
          }
          invoice.push(responseData);
         

        }
      }

    
      invoice_no = result[i].invoice_no; 
      payable_date = result[i].payable_date; 
      total_amt = total_amt + parseInt(result[i].amount); 
    }

    if (err){
      console.log(err);
    }
    else{

      var responseArray = {
        total_due_amount: total_amt,
        academic_session: result_session,
        invoices: invoice,
      }
     // console.log(result_session[0].session_name);

    var responseData = {
      //requestUrl: req.originalUrl,
      data: responseArray,
    }

    resp.send(responseData);
  }

  });
});

app.post('/get_dashboard_details/', function (req, resp) {

  masterModel.get_dashboard_details(connection, req.body.studentid, function (err, result, result1, result2, result3, result4) {
    console.log(req.body);
    if (err){
      console.log(err);
    }
    else{
      var responseData = {
        Current_Due_Module: result,
        Previous_Due_Module: result1,
        Total_Commitment_module: result2,
        Total_payment_Module: result3,
        Upcoming_Due_Module: result4,
      }
    console.log(responseData);
    resp.send(responseData);
  }

  });
});


app.listen(4000);