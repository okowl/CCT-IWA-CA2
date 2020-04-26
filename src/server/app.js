/**
 * @author Olga Kiseleva 2017136
 */

const express = require('express');
const router = express();
const port = process.env.PORT || 3000;
const address = process.env.IP || "0.0.0.0";

router.use(express.static('dist'));

router.listen(port, address, function() {
  console.log("Server listening at", address + ":" + port);
});