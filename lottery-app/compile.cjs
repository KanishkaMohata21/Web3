//if we use require() javascript will go to contract and starts executing and then it will realise that it is 
//not javascript so instead we will use

const path = require('path');
const fs = require('fs');
const solc = require('solc');

const currentDirectory = process.cwd();
const lotterypath = path.resolve(currentDirectory, 'contracts', 'lottery.sol');
const content = fs.readFileSync(lotterypath, 'utf8');
// console.log(solc.compile(content,1))
module.exports.compiledContent = solc.compile(content, 1).contracts[':Lottery'];


// we take our contract compiles it which gives us abi and bytecode
// and bytecode that will be send to ethereum network