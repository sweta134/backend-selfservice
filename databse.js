const{
     createConnection
}=require('mysql');

const pool = createConnection({
    host:"localhost",
    user:"root",
    password:"swag@1512",
    database:"selfservice"
})

pool.query('select * from student_master', (err, result, fields)=>{
    if(err){
        return console.log(err);
    }
    return console.log(result);
})