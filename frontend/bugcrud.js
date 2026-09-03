const prioritySelect = document.getElementById("priority-select");
const createButton = document.getElementById("create-button");
const requestButton = document.getElementById("request-button");
const deleteButton = document.getElementById("delete-button");
const updateButton = document.getElementById("update-button");
const token = localStorage.getItem("access_token")

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
    if (!bugTitle.trim() || !bugDescription.trim()){
        document.getElementById("create-message").innerHTML = "Enter valid values for bug data";
        setTimeout(() => {
            document.getElementById("create-message").innerHTML = ""
        }, 3000);
        return;
    }
    const bugobj = {
        title : bugTitle,
        description : bugDescription,
        priority : prior
    };

    try {
        const response = await fetch(url, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body: JSON.stringify(bugobj)
        });
        const result = await response.json();
        if (response.ok) {
            document.getElementById("create-message"),innerHTML = "Bug successfully created";
        } else {
            document.getElementById("create-message").innerHTML = "Bug was not created";

        }
        setTimeout(() => {
            document.getElementById("create-message").innerHTML = "";
        })
    } catch (error) {
        console.log("Error: ", error);
    }
}

async function getBugData(){
    const bugID = document.getElementById("bug-id-get").value;
    const url = `/api/bugs/${bugID}`;
    if(!bugID || isNaN(bugID)) {
        document.getElementById("get-message").innerHTML = "Enter a valid bug ID";
        setTimeout(() => {
            document.getElementById("get-message").innerHTML = ""
        }, 3000);
        return;
    }
    try {
        const response = await fetch(url, {
            method : "GET",
            headers : {
                "Authorization" : `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (response.ok) {
            let returnedobj = "";
            for (const[key, value] of Object.entries(result)){
                returnedobj += `${key} : ${value}<br>`;
            }      
            document.getElementById("get-message").innerHTML = returnedobj;     
        } else {
            document.getElementById("get-message").innerHTML = result.detail;

        }
        setTimeout(() => {
            document.getElementById("get-message").innerHTML = "";
        }, 3000);
    } catch (error) {
        console.log("Error : ", error);
    }
}

async function deleteBugData(){
    const bugID = document.getElementById("bug-id-delete").value;
    const url = `/api/bugs/${bugID}`
    if(!bugID || isNaN(bugID)){
        document.getElementById("delete-message").innerHTML = "Enter a valid bug ID";
        setTimeout(() => {
            document.getElementById("delete-message").innerHTML = ""
        }, 3000);
        return;
    }
    try {
        const response = await fetch(url, {
            method : "DELETE",
            headers : {
                "Authorization" : `Bearer ${token}`
            }
        });
        const result = await response.json();
        if (response.ok) {
            document.getElementById("delete-message").innerHTML = "Bug sucessfully deleted";
        } else {
            document.getElementById("delete-message").innerHTML = result.detail;
        }
        setTimeout(() => {
            document.getElementById("delete-message").innerHTML = "";
        }, 3000);
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
    if(!bugID || isNaN(bugID) || !bugTitle.trim() || !bugDescription.trim() || !bugStatus.trim()){
        document.getElementById("update-message").innerHTML = "Enter a valid values for updating bug";
        setTimeout(() => {
            document.getElementById("update-message").innerHTML = ""
        }, 3000);
        return;
    }
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
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body: JSON.stringify(bugobj)
        });
        const result = await response.json();
        if (response.ok) {
            document.getElementById("update-message").innerHTML = "Bug sucessfully updated";
        } else {
            document.getElementById("update-mesage").innerHTML = result.detail;
        }
        setTimeout(() => {
            document.getElementById("update-message").innerHTML = "";
        }, 3000);
    } catch (error) {
        console.log("Error : ", error)
    }
}