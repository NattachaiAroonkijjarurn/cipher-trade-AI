import { spawn } from "child_process";

// Replace 'python3' with 'python' or the appropriate command for your setup
// Also, adjust the path to your Python script as necessary
const pythonProcess = spawn("python", ["-u", "src/serverMT/server_mt.py"]);

pythonProcess.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

pythonProcess.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

pythonProcess.on("close", (code) => {
  console.log(`Python process exited with code ${code}`);
});
