const user = document.getElementById("username");
const pass = document.getElementById("password");
const login = document.getElementById("login-button");
const signup = document.getElementById("signup-button");

signup.addEventListener("click", () => {
    createUser();
});

login.addEventListener("click", () => {
    loginUser();
});

async function createUser(){
    const u = user.value;
    const p = pass.value;
    const url = "/api/bugs/register";
    if (!u || !p){
        document.getElementById("signup-message").innerHTML = "Enter a valid username and password";
        return;
    }
    const userobj = {
        username : u,
        password : p
    }
    try {
        const response = await fetch(url, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(userobj)
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById("signup-message").innerHTML = "User successfully created, please login.";
            await new Promise(resolve => setTimeout(resolve, 1500));
            location.reload();
        } else {
            document.getElementById("signup-message").innerHTML = "A user with that username already exists, please choose another";
        }
    } catch(error) {
        console.log("Error: ", error);
    }
}

async function loginUser(){
    const u = user.value;
    const p = pass.value;
    const url = "/api/auth/login";
    const userobj = {
        username : u,
        password : p
    };
    if (!u || !p){
        document.getElementById("signup-message").innerHTML = "Enter a valid username and password";
        return;
    }
    try{
        const response = await fetch(url, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(userobj)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            localStorage.setItem("access_token", result.access_token);
            document.getElementById("signup-message").innerHTML = "Login sucessful. Bringing you to homepage now";
            await new Promise(resolve => setTimeout(resolve, 1500));
            window.location.replace("/");
        } else {
            document.getElementById("signup-message").innerHTML = "Invalid username or password";
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}