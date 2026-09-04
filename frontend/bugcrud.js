const prioritySelect = document.getElementById("priority-select");
const createButton = document.getElementById("create-button");
const requestButton = document.getElementById("request-button");
const deleteButton = document.getElementById("delete-button");
const updateButton = document.getElementById("update-button");
const logoutButton = document.getElementById("logout-button");
const guestButtons = document.getElementById("guest-buttons");
const bugListSection = document.getElementById("bug-list-section");
const bugListContainer = document.getElementById("bug-list");

createButton.addEventListener("click", () =>{
    postBugData();
});

requestButton.addEventListener("click", () => {
    getBugData();
});

deleteButton.addEventListener("click", () => {
    deleteBugData();
});

updateButton.addEventListener("click", () => {
    updateBugData();
});

logoutButton.addEventListener("click", () => {
    logoutUser();
});

window.addEventListener("DOMContentLoaded", () => {
    checkAuthAndLoadBugs();
});

async function checkAuthAndLoadBugs(){
    const token = localStorage.getItem("access_token");
    if (!token){
        showLoggedOutUI();
        return;
    }
    try {
        const response = await fetch("/api/bugs", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok){
            const bugs = await response.json();
            showLoggedInUI();
            renderBugList(bugs);
        } else {
            localStorage.removeItem("access_token");
            showLoggedOutUI();
        }
    } catch (error) {
        console.log("Error: ", error);
        showLoggedOutUI();
    }
}

function showLoggedInUI(){
    guestButtons.style.display = "none";
    logoutButton.style.display = "inline-block";
    bugListSection.style.display = "block";
}

function showLoggedOutUI(){
    guestButtons.style.display = "flex";
    logoutButton.style.display = "none";
    bugListSection.style.display = "none";
    bugListContainer.innerHTML = "";
}


async function refreshBugList(){
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
        const response = await fetch("/api/bugs", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok){
            const bugs = await response.json();
            renderBugList(bugs);
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

function renderBugList(bugs){
    if (!bugs || bugs.length === 0){
        bugListContainer.innerHTML = `<p class="empty-state">No bugs yet. Create one above to get started.</p>`;
        return;
    }
    bugListContainer.innerHTML = "";
    bugs.forEach((bug) => {
        const priority = (bug.priority || "low").toLowerCase();
        const status = bug.status || "open";

        const item = document.createElement("div");
        item.className = "bug-item";
        item.innerHTML = `
            <div class="bug-item-header">
                <span class="bug-item-title">${escapeHtml(bug.title)}</span>
                <span class="badge badge-${escapeHtml(priority)}">${escapeHtml(priority)}</span>
            </div>
            <p class="bug-item-description">${escapeHtml(bug.description)}</p>
            <div class="bug-item-footer">
                <span class="badge badge-status">${escapeHtml(status)}</span>
                <span class="bug-item-id">#${escapeHtml(bug.id)}</span>
            </div>
        `;
        bugListContainer.appendChild(item);
    });
}

function escapeHtml(value){
    if (value === undefined || value === null) return "";
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

async function postBugData(){
    const bugTitle = document.getElementById("bug-name").value;
    const bugDescription = document.getElementById("bug-description").value;
    const prior = prioritySelect.value;
    const url = "/api/bugs";
    const token = localStorage.getItem("access_token");

    if (!bugTitle.trim() || !bugDescription.trim()){
        document.getElementById("create-message").innerHTML = "Enter valid values for bug data";
        setTimeout(() => {
            document.getElementById("create-message").innerHTML = "";
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
            document.getElementById("create-message").innerHTML = "Bug successfully created";
            refreshBugList();
        } else {
            document.getElementById("create-message").innerHTML = "Bug was not created";

        }
        setTimeout(() => {
            document.getElementById("create-message").innerHTML = "";
        }, 3000)
    } catch (error) {
        console.log("Error: ", error);
    }
}

async function getBugData(){
    const bugID = document.getElementById("bug-id-get").value;
    const url = `/api/bugs/${bugID}`;
    const token = localStorage.getItem("access_token");
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
    const url = `/api/bugs/${bugID}`;
    const token = localStorage.getItem("access_token");
    if(!bugID || isNaN(bugID)){
        document.getElementById("delete-message").innerHTML = "Enter a valid bug ID";
        setTimeout(() => {
            document.getElementById("delete-message").innerHTML = "";
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
            refreshBugList();
        } else {
            document.getElementById("delete-message").innerHTML = result.detail;
        }
        setTimeout(() => {
            document.getElementById("delete-message").innerHTML = "";
        }, 3000);
    } catch (error) {
        console.log("Error : ", error);
    }
}

async function updateBugData(){
    const bugID = document.getElementById("bug-id-update").value;
    const bugTitle = document.getElementById("bug-name-update").value;
    const bugDescription = document.getElementById("bug-description-update").value;
    const bugStatus = document.getElementById("bug-status-update").value;
    const prior = document.getElementById("priority-select-update").value;
    const url = `/api/bugs/${bugID}`;
    const token = localStorage.getItem("access_token");
    if(!bugID || isNaN(bugID) || !bugTitle.trim() || !bugDescription.trim() || !bugStatus.trim()){
        document.getElementById("update-message").innerHTML = "Enter a valid values for updating bug";
        setTimeout(() => {
            document.getElementById("update-message").innerHTML = "";
        }, 3000);
        return;
    }
    const bugobj = {
        title : bugTitle,
        description : bugDescription,
        status : bugStatus,
        priority : prior
    };
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
            refreshBugList();
        } else {
            document.getElementById("update-message").innerHTML = result.detail;
        }
        setTimeout(() => {
            document.getElementById("update-message").innerHTML = "";
        }, 3000);
    } catch (error) {
        console.log("Error : ", error);
    }
}

function logoutUser() {
    localStorage.removeItem("access_token");
    window.location.replace("/");
}