const adminAuth = (req, res, next) => {
    console.log("Admin auth is getting checked")
    const token = "7717abc"
    const authAdmin = token === "7717abc"
    if (!authAdmin) {
        res.status(401).send("Unauthorized request")
    }
    else {
        next()
    }
}

const userAuth = (req, res, next) => {
    console.log("User auth is getting checked")
    const token = "7717abc"
    const authUser = token === "7717abc"
    if (!authUser) {
        res.status(401).send("Unauthorized request")
    }
    else {
        next()
    }
}

module.exports = {adminAuth, userAuth}