const user = document.getElementById("username")
const pass = document.getElementById("password")
const login = document.getElementById("login-button")
const signup = document.getElementById("signup-button")

signup.addEventListener("click", () => {
    createUser()
});

login.addEventListener("click", () => {
    loginUser()
})

async function createUser(){
    const u = user.value;
    const p = pass.value;
    const url = "/api/bugs/register";
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
    }
    try{
        const response = await fetch(url, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(userobj)
        });
        const result = await response.json()
    } catch (error) {
        console.log("Error: ", error);
    }
}