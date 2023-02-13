const express = require ("express");
const app = express();
const bodyParser = require ("body-parser");
const mailChimp = require ("@mailchimp/mailchimp_marketing");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mailChimp.setConfig({
    apiKey: "",
    server: "us21"
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
    const listId = "";
    const newUser = {
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.body.email           
    };
    async function run () {
        const response = await mailChimp.lists.addListMember(listId, {
            email_address: newUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: newUser.firstName,
                LNAME: newUser.lastName
            }
        });
        res.sendFile(__dirname + "/success.html");
        console.log("added user");
    }
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
});
app.post("/failure", function (req, res) {
    res.redirect("/");
});
app.listen(3000, function () {
    console.log("sever is running on port 3000");
});
