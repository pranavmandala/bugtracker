const prioritySelect = document.getElementById("priority-select");
const createButton = document.getElementById("create-button");
const requestButton = document.getElementById("request-button");
const deleteButton = document.getElementById("delete-button");
const updateButton = document.getElementById("update-button");
const login = document.getElementById("login-button")
const signup = document.getElementById("signup-button")
const user = document.getElementById("username")
const pass = document.getElementById("password")

signup.addEventListener("click", () => {
    createUser()
});

createButton.addEventListener("click", () =>{
    postBugData();
});

requestButton.addEventListener("click", () => {
    getBugData();
})

deleteButton.addEventListener("click", () => {
    deleteBugData();
});

updateButton.addEventListener("click", () => {
    updateBugData();
})

async function postBugData(){
    const bugTitle = document.getElementById("bug-name").value;
    const bugDescription = document.getElementById("bug-description").value;
    const prior = prioritySelect.value;
    const url = "/api/bugs";
    const bugobj = {
        title : bugTitle,
        description : bugDescription,
        priority : prior
    };

    try {
        const response = await fetch(url, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(bugobj)
        });

        const result = await response.json();
    } catch (error) {
        console.log("Error: ", error);
    }
}

async function getBugData(){
    const bugID = document.getElementById("bug-id-get").value;
    const url = `/api/bugs/${bugID}`;
    try {
        const response = await fetch(url, {
            method : "GET"
        });
        const result = await response.json();
    } catch (error) {
        console.log("Error : ", error);
    }
}

async function deleteBugData(){
    const bugID = document.getElementById("bug-id-delete").value;
    const url = `/api/bugs/${bugID}`
    try {
        const response = await fetch(url, {
            method : "DELETE"
        });
        const result = await response.json();
    } catch (error) {
        console.log("Error : ", error)
    }
}

async function updateBugData(){
    const bugID = document.getElementById("bug-id-update").value;
    const bugTitle = document.getElementById("bug-name-update").value;
    const bugDescription = document.getElementById("bug-description-update").value;
    const bugStatus = document.getElementById("bug-status-update").value;
    const prior = document.getElementById("priority-select-update").value;
    const url = `/api/bugs/${bugID}`;
    const bugobj = {
        title : bugTitle,
        description : bugDescription,
        status : bugStatus,
        priority : prior
    }
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(bugobj)
        });
        const result = await response.json();
    } catch (error) {
        console.log("Error : ", error)
    }
}

async function createUser(){
    console.log("create user");
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