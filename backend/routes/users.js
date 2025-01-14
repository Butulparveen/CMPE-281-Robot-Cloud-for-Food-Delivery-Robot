var express = require("express");
var router = express.Router();
const pool = require("../utils/mysqlConnection");
const { STATUS_CODE, MESSAGES } = require("../utils/constants");

router.get("/allActiveUsers", async (req, res) => {
  try {
    return await pool.query(
      "select * from user where is_active = 1",
      async function (error, result) {
        console.log("active iusers", result)
        res.status(STATUS_CODE.SUCCESS).send({ status: STATUS_CODE.SUCCESS, payload: result });
      });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send({ status: STATUS_CODE.INTERNAL_SERVER_ERROR, payload: error });
  }
});

router.get("/allRegUsers", async (req, res) => {
  try {
    return await pool.query(
      "select * from user",
      async function (error, result) {
        console.log("resiltAll iusers", result)
        res.status(STATUS_CODE.SUCCESS).send({ status: STATUS_CODE.SUCCESS, payload: result });
      });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send({ status: STATUS_CODE.INTERNAL_SERVER_ERROR, payload: error });
  }
});

router.get("/schedule", async (req, res) => {
  try {
    return await pool.query(
      "select * from robot_schedule",
      async function (error, result) {
        console.log("schedule list", result)
        res.status(STATUS_CODE.SUCCESS).send({ status: STATUS_CODE.SUCCESS, payload: result });
      });
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send({ status: STATUS_CODE.INTERNAL_SERVER_ERROR, payload: error });
  }
});



router.post("/createSchedule", async (req, res) => {
  let schedule = req.body;
  console.log("backend create schedule", schedule);
  try {
      return await pool.query(
          `INSERT INTO robot_schedule (robot_id, user_id, hotel_id, floor_id, table_id, start_date_time, end_date_time) VALUES ('${schedule.robotId}', '${schedule.userId}', '${schedule.hotelId}', '${schedule.floorId}', '${schedule.tableId}', '${schedule.startDateTime}', '${schedule.endDateTime}');`,
          async (err, sqlResult) => {
              console.log("sql", sqlResult)
              if (sqlResult && sqlResult.affectedRows > 0) {
                  res.status(STATUS_CODE.SUCCESS).send({ status: STATUS_CODE.SUCCESS, payload: sqlResult });
              } else {
                  res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send({ status: STATUS_CODE.INTERNAL_SERVER_ERROR, payload: "error" });
              }
          }
      );
  } catch (error) {
      res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send({ status: STATUS_CODE.INTERNAL_SERVER_ERROR, payload: error });
  }
});


router.post("/updateServiceOperations", async(req,res)=>{
  try {
    let userId = req.body.userId;
    let rows =0;
    console.log(`select * from billing_details where  user_id = ${userId} and roboId = ${req.body.roboId}`);
    await pool.query(`select * from billing_details where  user_id = ${userId} and roboId = '${req.body.roboId}'`, 
    
    async (error, result) => {
      // console.log("count:: ", result.length ) ;
      rows = result.length
      if(rows>0){
        return await pool.query(
          `update billing_details set operations = operations +1  where user_id = ${userId} and roboId = '${req.body.roboId}' `,
          async function (error, result) {
            console.log("resiltAll iusers", result, error)
            res.status(STATUS_CODE.SUCCESS).send({ status: STATUS_CODE.SUCCESS, payload: result });
          });
      }else{
        return await pool.query(
          `insert into billing_details(user_id, roboId, operations) values ('${userId}','${req.body.roboId}', 1 )`,
          async function (error, result) {
            console.log("resiltAll iusers", result, error)
            res.status(STATUS_CODE.SUCCESS).send({ status: STATUS_CODE.SUCCESS, payload: result });
          });
      }
    }) 
    //console.log("count : ", result);
    
    
  } catch (error) {
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send({ status: STATUS_CODE.INTERNAL_SERVER_ERROR, payload: error });
  }


})

module.exports = router;
