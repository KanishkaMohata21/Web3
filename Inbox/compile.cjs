//if we use require() javascript will go to contract and starts executing and then it will realise that it is
//not javascript so instead we will use

const path = require("path");
const fs = require("fs");
const solc = require("solc");

const currentDirectory = process.cwd();
const contractPath = path.resolve(currentDirectory, "contracts", "Inbox.sol");
const content = fs.readFileSync(contractPath, "utf8"); //utf8-returns content as string
//const input defines the input JSON object that will be passed to the Solidity compiler.
const input = {
  language: "Solidity",
  sources: {
    "Inbox.sol": {
      content: content,
    },
  },
  settings: {
    //outputSelection defines what outputs the compiler should produce. 
    //The '*': { '*': ['*'], } notation means that for all contracts ('*'), 
    //for all parts ('*'), include all outputs (['*']).
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

//Converts the input object to a JSON string using JSON.stringify, compiles it using solc.compile, 
//and then parses the compiler output back into a JavaScript object using JSON.parse.
module.exports = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Inbox.sol"
].Inbox;

// we take our contract compiles it which gives us abi and bytecode
// and bytecode that will be send to ethereum network
