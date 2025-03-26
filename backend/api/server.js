const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, "public")))

// Banker's Algorithm implementation
app.post("/bankers", (req, res) => {
  const { allocation, maxMatrix, available, processCount, resourceCount } = req.body

  // Calculate Need Matrix
  const needMatrix = []
  for (let i = 0; i < processCount; i++) {
    needMatrix[i] = []
    for (let j = 0; j < resourceCount; j++) {
      needMatrix[i][j] = maxMatrix[i][j] - allocation[i][j]

      // Validation: Need cannot be negative
      if (needMatrix[i][j] < 0) {
        return res.status(400).json({
          error: "Invalid input: Allocation exceeds maximum for some resources",
        })
      }
    }
  }

  // Initialize tracking variables
  const work = [...available]
  const finish = new Array(processCount).fill(false)
  const safeSequence = []
  const steps = []

  // Initial step
  steps.push({
    type: "info",
    message: "Starting Banker's Algorithm execution",
  })

  steps.push({
    type: "info",
    message: `Initial Available Resources: [${work.join(", ")}]`,
  })

  // Safety Algorithm
  let count = 0
  let iteration = 0
  const MAX_ITERATIONS = processCount * 2 // Prevent infinite loops

  while (count < processCount && iteration < MAX_ITERATIONS) {
    iteration++
    let found = false

    steps.push({
      type: "info",
      message: `Iteration ${iteration}: Looking for a process that can be executed safely`,
    })

    for (let i = 0; i < processCount; i++) {
      if (!finish[i]) {
        let canExecute = true

        // Check if all resource needs can be met
        for (let j = 0; j < resourceCount; j++) {
          if (needMatrix[i][j] > work[j]) {
            canExecute = false
            break
          }
        }

        if (canExecute) {
          // Process can be executed
          steps.push({
            type: "success",
            message: `Process P${i} can be executed with available resources [${work.join(", ")}]`,
          })

          // Update work array (resources released after process completes)
          const oldWork = [...work]
          for (let j = 0; j < resourceCount; j++) {
            work[j] += allocation[i][j]
          }

          steps.push({
            type: "resource",
            message: `P${i} releases resources: [${allocation[i].join(", ")}], New available: [${work.join(", ")}]`,
          })

          // Mark process as finished and add to safe sequence
          safeSequence.push(i)
          finish[i] = true
          found = true
          count++
          break
        } else {
          // Process cannot be executed yet
          steps.push({
            type: "info",
            message: `Process P${i} needs [${needMatrix[i].join(", ")}] but only [${work.join(", ")}] available`,
          })
        }
      }
    }

    if (!found && count < processCount) {
      // No process could be executed, deadlock detected
      steps.push({
        type: "error",
        message: "No process can be executed with current available resources. Deadlock detected!",
      })

      return res.json({
        isSafe: false,
        needMatrix,
        steps,
      })
    }
  }

  // Check if all processes were executed
  if (count === processCount) {
    steps.push({
      type: "success",
      message: `All processes can execute safely in sequence: P${safeSequence.join(" → P")}`,
    })

    return res.json({
      isSafe: true,
      safeSequence,
      needMatrix,
      steps,
    })
  } else {
    steps.push({
      type: "error",
      message: "Algorithm did not complete successfully. Possible deadlock.",
    })

    return res.json({
      isSafe: false,
      needMatrix,
      steps,
    })
  }
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Open http://localhost:${PORT} in your browser`)
})

