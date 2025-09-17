const prisma = require("../lib/prisma")
const crypto = require("crypto")

const createUser = async (req, res) => {
    const { name, email } = req.body;
    const username = crypto.randomBytes(12).toString('hex');
    try {
        const user = await prisma.user.create({
            data: {
                name: name,
                username: username,
                email: email,
            }

        })
        if (user) {
            console.log("User created successfully:", user);
            res.status(200).json({
                success: true,
                message: "User created successfully"
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message
        });

    }


}
module.exports = {
    createUser
}