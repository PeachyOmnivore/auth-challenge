import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { registerUserDB, findUser } from '../domain/user.js';
const jwtSecret = "mysecret";

const register = async (req, res) => {
    const { username, password } = req.body;

    if (!password || !username) {
        return res.status(409).json({error: "Please enter username or password"});
    }
    try {
        const hash = await bcrypt.hash(password, 12);
        
        const createdUser = await registerUserDB(username, hash);
        res.status(201).json({ data: createdUser });

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ error: err.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    console.log(username)

    const foundUser = await findUser(username)
    console.log("FOUND USER", foundUser)

    if (!foundUser) {
        return res.status(401).json({ error: "Invalid username or password." });
    }

    const passwordsMatch = await bcrypt.compare(password, foundUser.password)
    console.log(passwordsMatch)

    if (!passwordsMatch) {
        return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign(username, jwtSecret)
    res.status(201).json({ data: token });
};

export { register, login };
