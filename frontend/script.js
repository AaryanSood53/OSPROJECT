// 🔹 Navigate to Homepage
function goToHome() {
    window.location.href = "index.html";
}

// 🔹 Show possible allocations & detect deadlocks or waiting states
function showAllocations() {
    let processCount = parseInt(document.getElementById("processCount").value);
    let resourceCount = parseInt(document.getElementById("resourceCount").value);
    let resultDiv = document.getElementById("result");

    if (!processCount || !resourceCount || processCount < 1 || resourceCount < 1) {
        alert("⚠️ Please enter valid numbers for processes and resources.");
        return;
    }

    resultDiv.innerHTML = "🔍 Generating possible allocations...";

    setTimeout(() => {
        let tableHTML = `<h2 class='text-2xl font-bold mb-3'>Possible Allocations:</h2>
                         <div class="overflow-auto max-h-96 p-4 border border-gray-500 rounded-lg w-full bg-gray-800 text-white shadow-xl">
                         <table class="border border-gray-400 w-full text-center">
                         <tr class="bg-gray-700 text-white"><th>Scenario</th>`;

        for (let r = 0; r < resourceCount; r++) {
            tableHTML += `<th>Resource ${r + 1}</th>`;
        }
        tableHTML += `<th>Status</th></tr>`;

        let scenarios = [];
        for (let i = 0; i < Math.pow(2, processCount * resourceCount); i++) {
            let allocation = [];
            let binary = i.toString(2).padStart(processCount * resourceCount, "0");

            for (let j = 0; j < binary.length; j += resourceCount) {
                let processAlloc = binary.slice(j, j + resourceCount).split("").map(Number);
                allocation.push(processAlloc);
            }

            let { state, waitingProcesses } = checkDeadlockState(allocation, processCount, resourceCount);
            let rowHTML = `<tr><td>Scenario ${i + 1}</td>`;

            for (let p = 0; p < processCount; p++) {
                let labeledAllocation = allocation[p].map((val, idx) => `R${idx + 1}: ${val}`).join(", ");
                rowHTML += `<td>P${p + 1} → [${labeledAllocation}]</td>`;
            }

            if (state === "safe") {
                scenarios.push(rowHTML + `<td class='text-green-400 font-bold'>✅ Safe</td></tr>`);
            } else if (state === "waiting") {
                scenarios.push(rowHTML + `<td class='text-yellow-400 font-bold'>⏳ Waiting (${waitingProcesses.join(", ")})</td></tr>`);
            } else {
                scenarios.push(rowHTML + `<td class='text-red-400 font-bold'>❌ Deadlock</td></tr>`);
            }
        }

        tableHTML += scenarios.join("") + "</table></div>";

        resultDiv.innerHTML = tableHTML;
    }, 1000);
}

// 🔹 Function to check if a state is safe, waiting, or deadlock
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

// 🔹 Ensure `script.js` is loaded after DOM content
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ script.js Loaded Successfully!");

    let homeButton = document.getElementById("homeButton");
    if (homeButton) {
        homeButton.addEventListener("click", goToHome);
    }
});
