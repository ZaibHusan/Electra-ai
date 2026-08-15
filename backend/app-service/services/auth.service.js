

export const loginService = async (email, password) => {
    
    if (email === process.env.USER_EMAIL && password === process.env.USER_PASSWORD) {
        return true;
    }
    return false;
}