/**
 * Master Model
 */


var x;
module.exports = {

  //Customer

  get_student: function (connection, id, controllerCallback) {
    var sql = " SELECT * from student_master WHERE studentID= '" + id + "' and status= 'Active' ";
    x = id;
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    })
  },

  add_studentotp: function (connection, id, otp, controllerCallback) {
    var sql = " INSERT INTO loginotp (studentid,otp,isActive,LoginAt) "
      + " VALUES('" + id + "','" + otp + "','1',now()) ";
    // console.log(sql);       
    connection.query(sql, (err, result) => {

      var sql = " SELECT contactNo from student_master WHERE studentID= '" + id + "' and status= 'Active' ";
      connection.query(sql, (err, resultStudent) => {
        controllerCallback(err, otp, resultStudent);
      })

    })

  },

  get_otp: function (connection, id, otp, controllerCallback) {
    var sql = " SELECT otp from loginotp WHERE studentID= '" + id + "' and otp='" + otp + "' and IsActive= '1' ";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    })
  },

  update_otp: function (connection, id, otp, controllerCallback) {
    var sql = " UPDATE loginotp SET IsActive='0' WHERE studentID='" + id + "'and otp='" + otp + "'";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    })
  },

  update_session: function (connection, otp, controllerCallback) {
    var sql = " UPDATE loginotp SET IsActive='0' WHERE LoginAt < NOW() - interval 10 MINUTE AND IsActive='1'";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    })
  },

  get_transaction: function (connection, id, controllerCallback) {
    var sql = " SELECT tran_date AS Transaction_date,recepept_id AS Receipt_ID,paid_amount AS Paid_amount,tran_mode AS mode from transaction_master WHERE student_id='" + x + "' and is_synced= 'Y'; ";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    })
  },

  get_commitment: function (connection, id, controllerCallback) {
    var sql = "SELECT DISTINCT(payable_amount) AS TOTAL_FEES from transaction_master WHERE student_id= '" + x + "' and is_synced= 'Y';";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    })
  },

  get_paidAmount: function (connection, id, controllerCallback) {
    var sql = "SELECT SUM(paid_amount) AS Total_Paid_Amount FROM transaction_master WHERE student_id='" + x + "' AND is_synced='Y' AND chec='Paid'; ";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    })
  },

  get_current_dues: function (connection, id, controllerCallback) {
    var sql = " SELECT SUM(paid_amount) AS Current_Due from transaction_master WHERE student_id='" + id + "' and is_synced= 'Y' AND statu='Pending' AND chec='Unpaid'OR(SELECT COUNT(Statu)WHERE statu='Pending')>1;";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    })
  },
  get_upcoming_dues: function (connection, id, controllerCallback) {
    var sql = "SELECT SUM(paid_amount) AS Upcomming_Due from transaction_master WHERE student_id='" + id + "' and is_synced= 'Y'AND statu='Upcoming' AND chec='Unpaid'";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    })
  },

  get_previous_dues: function (connection, id, controllerCallback) {
    var sql = "SELECT Sum(paid_amount) AS Previous_Due from transaction_master WHERE student_id='" + id + "' and is_synced= 'Y' AND statu='Pending' AND chec='Unpaid'AND tran_date<'2021-07-01';";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    })
  },

  get_dashboard_data: function (connection, id, controllerCallback) {
    var sql =
      "SELECT Sum(paid_amount) AS Previous_Due from transaction_master WHERE student_id='" +
      id +
      "' and is_synced= 'Y' AND statu='Pending' AND chec='Unpaid'AND tran_date<'2021-07-01';";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    });
  },

  get_current_due_detail_sum: function (connection, id, controllerCallback) {
    var sql =
      "SELECT SUM(C.amount) AS Current_Due FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1'";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    });
  },

  get_current_due_detail: function (connection, id, controllerCallback) {
    var sql =
      "SELECT D.component_name,C.amount,B.invoice_no,D.slno FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1' ;";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    });
  },

  get_previous_due_detail_sum: function (connection, id, controllerCallback) {
    var sql =
      "SELECT SUM(C.amount) AS Previous_Due FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1'AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1) LIMIT 5;";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    });
  },

  get_previous_due_detail: function (connection, id, controllerCallback) {
    var sql =
      "SELECT D.component_name,C.amount,B.invoice_no,D.slno FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1);";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    });
  },

  get_invoice_no: function (connection, id, controllerCallback) {
    var sql =
      `SELECT A.invoice_id,SUM(A.amount) AS amount,C.payable_date,CONCAT("[",GROUP_CONCAT(CONCAT("fees_component:'",B.component_name,"'"),CONCAT(",amount:'",A.amount,"'}")),"]") AS FeeComponents FROM invoice_componets A INNER JOIN fees_components_master B ON A.fees_components_master_id=B.id INNER JOIN invoice C ON A.invoice_id=C.invoice_no WHERE A.invoice_id IN (SELECT invoice_no FROM invoice WHERE studentid='"+x+"' AND STATUS='1' AND academic_session_id=(SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1) ORDER BY payable_date)GROUP BY invoice_id;`;

    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    });
  },

  get_previous_due_detail_secondTable: function (connection, id, controllerCallback) {
    var sql =
      "SELECT D.component_name,C.amount,B.invoice_no,D.slno FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1) LIMIT 5,10;";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    });
  },
  get_Total_invoice_amount: function (connection, id, controllerCallback) {
    var sql =
      "SELECT SUM(C.amount) Total_invoice_amount FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1) GROUP BY D.component_name LIMIT 1";
    connection.query(sql, (err, result) => {
      controllerCallback(err, result);
    });
  },

  get_previous_details: function (connection, id, controllerCallback) {
    var sql =
      " SELECT B.invoice_no,B.payable_date,B.payable_date, D.component_name,C.amount,D.slno FROM student_master A"
      + " INNER JOIN Invoice B on A.studentID = B.studentid"
      + " INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id"
      + " INNER JOIN fees_components_master D on C.fees_components_master_id = D.id"
      + " INNER JOIN academic_session E on B.academic_session_id = E.id"
      + " WHERE B.studentid='" + x + "' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1 ) ORDER BY B.invoice_no"
    connection.query(sql, (err, result) => {

      sql = "SELECT DISTINCT E.session_name FROM student_master A INNER JOIN invoice  B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id  INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1);";
      connection.query(sql, (err, result_session) => {

        controllerCallback(err, result, result_session);
      });


    });
  },

  get_upcoming_details: function (connection, id, controllerCallback) {
    var sql =
      " SELECT B.invoice_no,B.payable_date,B.payable_date, D.component_name,C.amount,D.slno FROM student_master A"
      + " INNER JOIN Invoice B on A.studentID = B.studentid"
      + " INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id"
      + " INNER JOIN fees_components_master D on C.fees_components_master_id = D.id"
      + " INNER JOIN academic_session E on B.academic_session_id = E.id"
      + " WHERE B.studentid='" + x + "' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1 OFFSET 1) ORDER BY B.invoice_no;"
    connection.query(sql, (err, result) => {

      sql = "SELECT DISTINCT E.session_name FROM student_master A INNER JOIN invoice  B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id  INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1);";
      connection.query(sql, (err, result_session) => {

        controllerCallback(err, result, result_session);
      });


    });
  },

  get_current_details: function (connection, id, controllerCallback) {
    var sql =
      " (SELECT E.session_name,B.invoice_no,B.payable_date, D.component_name,C.amount,D.slno FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1 ) ORDER BY B.invoice_no)UNION (SELECT E.session_name,B.invoice_no,B.payable_date, D.component_name,C.amount,D.slno FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1' AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='1' LIMIT 1 ) ORDER BY B.invoice_no);"
    connection.query(sql, (err, result) => {

      sql = "SELECT DISTINCT E.session_name FROM student_master A INNER JOIN invoice  B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id  INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1';";
      connection.query(sql, (err, result_session) => {

        controllerCallback(err, result, result_session);
      });


    });
  },

  get_dashboard_details: function (connection, id, controllerCallback) {
    var sql =
      "SELECT SUM(C.amount) AS CURRENT_DUE FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1'"
    connection.query(sql, (err, result) => {
      sql =
        "SELECT SUM(C.amount) AS PREVIOUS_DUE FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" + x + "' AND B.`status`='1'AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1) LIMIT 5;"
      connection.query(sql, (err, result1) => {
        sql = "SELECT DISTINCT(payable_amount) AS TOTAL_COMMITMENT from transaction_master WHERE student_id= '" + x + "' and is_synced= 'Y'"

        connection.query(sql, (err, result2) => {
          sql = "SELECT SUM(paid_amount) AS TOTAL_PAID_AMOUNT FROM transaction_master WHERE student_id='" + x + "' AND is_synced='Y' AND chec='Paid'"
          connection.query(sql, (err, result3) => {
            sql = "SELECT SUM(C.amount) AS UPCOMING_DUE FROM student_master A INNER JOIN Invoice B on A.studentID = B.studentid INNER JOIN Invoice_Componets C on B.invoice_no = C.invoice_id INNER JOIN fees_components_master D on C.fees_components_master_id = D.id INNER JOIN academic_session E on B.academic_session_id = E.id WHERE B.studentid='" +
              id +
              "' AND B.`status`='1'AND B.academic_session_id = (SELECT id FROM academic_session WHERE is_current_session='0' LIMIT 1 OFFSET 1 ) LIMIT 5;"
            connection.query(sql, (err, result4) => {
              controllerCallback(err, result, result1, result2, result3, result4);
            });
          });
        });
      });
    });
  },

}
