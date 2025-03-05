import readline from "readline";
import { exec, spawn } from "child_process";
import process from "process";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function shellPrompt() {
  process.stdout.write(chalk.green("my_shell> ") + chalk.blue(""));
}

rl.on("line", (input) => {
    const trimmedOutput = input.trim();
    if (!trimmedOutput) {
        shellPrompt();
        return;
    }
    const args = trimmedOutput.split(" ");
    const command = args.shift();

    if (command === 'exit') {
        console.log(chalk.yellow('Bye!'));
        rl.close();
        return;
    }

    if (command === "cd") {
        try {
            process.chdir(args[0] || process.env.HOME)
        } catch (err) {
            console.error(chalk.red(`cd: ${err.message}`));
        }
        shellPrompt();
        return;
    }

    const runInBackground = args[args.length - 1] === "&";
    if (runInBackground) {
        args.pop();
    } 
    executeCommand(command, args, runInBackground);


})
// rl.question("my_shell>", (input) => {
//   const args = input.trim().split(" ");
//   const command = args.shift();

//   if (!command) {
//     shellPrompt();
//     return;
//   }

//   if (command === "exit") {
//     console.log("Bye!");
//     rl.close();
//     return;
//   }

//   if (command === "cd") {
//     try {
//       process.chdir(args[0] || process.env.HOME);
//     } catch (err) {
//       console.log(`cd: ${err.message}`);
//     }
//     shellPrompt();
//     return;
//   }

//   executeCommand(command, args);
// });

function executeCommand(command, args, background) {
  const child = spawn(command, args, {
    stdio: background ? "ignore" : "inherit",
    shell: true,
    detached: background,
});

if (background) {
    console.log(chalk.cyan(`Started ${command} in background.`));
    child.unref();
    shellPrompt();
} else {
    child.on("exit", () => {
        shellPrompt();
    })
}

  child.on("Error", (err) => {
    console.error(chalk.red(`Error: ${err.message}`));
  });
  child.on("exit", () => {
    shellPrompt();
  });
}

shellPrompt();
