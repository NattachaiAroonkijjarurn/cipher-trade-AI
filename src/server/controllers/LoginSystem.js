const signUp = async(req, res) => {
    res.send("Register");
}

const signIn = async(req, res) => {
    res.send("Login")
}

export {signUp, signIn}