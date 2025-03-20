// 🔹 Move back to the learning page
function backToHome() {
    window.location.href = "deadlock.html";
}

// 🔹 Move to Homepage
function goToHome() {
    window.location.href = "index.html";
}

// 🔹 Generate input fields dynamically based on user input
function generateAllocationInputs() {
    let processCount = parseInt(document.getElementById("userProcessCount").value);
    let resourceCount = parseInt(document.getElementById("userResourceCount").value);
    let allocDiv = document.getElementById("allocationInputs");
    let checkButton = document.getElementById("checkButton");

    // 🔥 Ensure valid input before generating fields
    if (!processCount || !resourceCount || processCount < 1 || resourceCount < 1) {
        alert("⚠️ Please enter valid numbers for processes and resources.");
        return;
    }

    // 🔥 Clear previous inputs before generating new ones
    allocDiv.innerHTML = "<h2 class='text-xl font-bold mb-3'>Enter Resource Allocations:</h2>";

    for (let p = 0; p < processCount; p++) {
        let rowHTML = `<label class="block mt-2 font-semibold">P${p + 1} Resource Allocation:</label><div class="flex">`;
        for (let r = 0; r < resourceCount; r++) {
            rowHTML += `<input type="number" id="alloc_P${p}_R${r}" min="0" max="1" step="1"
                        class="p-2 text-black border rounded w-1/4 mx-1 no-arrows" placeholder="R${r + 1}" 
                        oninput="validateInput(this)">`;
        }
        rowHTML += `</div>`;
        allocDiv.innerHTML += rowHTML;
    }

    checkButton.classList.remove("hidden"); // 🔥 Make "Check Deadlock Status" button visible
}

// 🔹 Ensure input is strictly 0 or 1
function validateInput(input) {
    let value = parseInt(input.value);
    if (value < 0) input.value = 0;
    if (value > 1) input.value = 1;
}

// 🔹 Check User Allocation & Display Deadlock Status
function checkUserAllocation() {
    let processCount = parseInt(document.getElementById("userProcessCount").value);
    let resourceCount = parseInt(document.getElementById("userResourceCount").value);
    let allocResult = document.getElementById("allocResult");

    let allocation = [];
    for (let p = 0; p < processCount; p++) {
        let processAlloc = [];
        for (let r = 0; r < resourceCount; r++) {
            let value = parseInt(document.getElementById(`alloc_P${p}_R${r}`).value);
            if (isNaN(value) || value < 0 || value > 1) {
                alert(`⚠️ Invalid input for P${p + 1} R${r + 1}. Only 0 or 1 is allowed.`);
                return;
            }
            processAlloc.push(value);
        }
        allocation.push(processAlloc);
    }

    let { state, waitingProcesses } = checkDeadlockState(allocation, processCount, resourceCount);

    if (state === "safe" && waitingProcesses.length === 0) {
        allocResult.innerHTML = "✅ Safe Allocation! No deadlock detected.";
        allocResult.classList.remove("text-red-400", "text-yellow-400");
        allocResult.classList.add("text-green-400");
    } else if (state === "waiting") {
        allocResult.innerHTML = `⏳ Waiting State! Processes (${waitingProcesses.join(", ")}) are waiting for resources.`;
        allocResult.classList.remove("text-green-400", "text-red-400");
        allocResult.classList.add("text-yellow-400");
    } else {
        allocResult.innerHTML = `❌ Deadlock Detected! <br> 
        🔄 <b>Suggestion:</b> Reduce resource allocation to one of the processes.`;
        allocResult.classList.remove("text-green-400", "text-yellow-400");
        allocResult.classList.add("text-red-400");
    }
}

// 🔹 Deadlock State Checker
function checkDeadlockState(allocation, processCount, resourceCount) {
    let availableResources = new Array(resourceCount).fill(1);
    let finish = new Array(processCount).fill(false);
    let waitingProcesses = [];
    let progressMade = true;
    let totalAllocated = new Array(resourceCount).fill(0);

    // Calculate total allocated resources
    for (let i = 0; i < processCount; i++) {
        for (let j = 0; j < resourceCount; j++) {
            totalAllocated[j] += allocation[i][j];
        }
    }

    // 🔥 FIX: Detect Over-Allocation
    for (let j = 0; j < resourceCount; j++) {
        if (totalAllocated[j] > availableResources[j]) {
            return { state: "deadlock", waitingProcesses: [], fixSuggestion: "Reduce allocation of over-used resources." };
        }
    }

    // Try freeing up processes using Banker's Algorithm
    while (progressMade) {
        progressMade = false;
        for (let i = 0; i < processCount; i++) {
            if (!finish[i]) {
                let canProceed = true;
                for (let j = 0; j < resourceCount; j++) {
                    if (allocation[i][j] > availableResources[j]) {
                        canProceed = false;
                        break;
                    }
                }
                if (canProceed) {
                    finish[i] = true;
                    progressMade = true;
                    for (let j = 0; j < resourceCount; j++) {
                        availableResources[j] += allocation[i][j];
                    }
                }
            }
        }
    }

    // Identify waiting processes
    for (let i = 0; i < processCount; i++) {
        if (!finish[i]) waitingProcesses.push(`P${i + 1}`);
    }

    if (waitingProcesses.length === 0) return { state: "safe", waitingProcesses: [] };
    if (waitingProcesses.length < processCount) return { state: "waiting", waitingProcesses };
    return { state: "deadlock", waitingProcesses };
}

// 🔹 Ensure buttons are working on page load
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script2.js Loaded Successfully!");

    let allocateButton = document.getElementById("allocateButton");
    if (allocateButton) {
        allocateButton.addEventListener("click", generateAllocationInputs);
    }

    let checkButton = document.getElementById("checkButton");
    if (checkButton) {
        checkButton.addEventListener("click", checkUserAllocation);
    }

    let backButton = document.getElementById("backButton");
    if (backButton) {
        backButton.addEventListener("click", backToHome);
    }

    let homeButton = document.getElementById("homeButton");
    if (homeButton) {
        homeButton.addEventListener("click", goToHome);
    }
});
