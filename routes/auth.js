const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

router.get("/sign-up", (req, res, next) => {
    res.render("sign-up");
});

router.post("/sign-up", (req, res, next) => {
    const { username, password } = req.body;

    const encrypted = bcrypt.hashSync(password, 10);

    new User({ username, password: encrypted }).save().then(result => {
        res.render("sign-in");
    });
});

// sign in

router.get("/sign-in", (req, res, next) => {
    res.render("sign-in");
});
router.post("/sign-in", (req, res, next) => {
    const { username, password } = req.body;

    User.findOne({ username }).then(user => {
        if (!user) return res.render("sign-in", { error: "No such user" });

        const passwordsMatch = bcrypt.compareSync(password, user.password);
        if (!passwordsMatch) return res.render("sign-in", { error: "Wrong password" });

        // create cookie
        const cleanUser = user.toObject();
        delete user.password; // very important!!!
        req.session.currentUser = cleanUser;
        //
        res.send("You're logged in!");
    });
});

module.exports = router;
