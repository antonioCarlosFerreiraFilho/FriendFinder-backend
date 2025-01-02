const express = require("express");
const router = express();

//User Routes..
router.use("/api/Users", require("./UserRoutes"));
//Posts Routes..
router.use("/api/Posts", require("./PostRoutes"));

//Route primary
router.get("/", (req, res)=> {

  res.send("Blog");
});

module.exports = router;