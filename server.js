const app = require("./app");

require("dotenv").config;
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server listeniing to requests on port ${port} `);
})