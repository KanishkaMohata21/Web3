const path = require('path');
const fs = require('fs');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.rmSync(buildPath, { recursive: true, force: true });

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const compiledOutput = solc.compile(JSON.stringify(input));
const output = JSON.parse(compiledOutput);

console.log("Compiled Output:", output);

if (!output.contracts || !output.contracts['Campaign.sol']) {
    console.error("Compilation failed: Could not find 'Campaign.sol' in the output.");
    if (output.errors) {
        console.error("Errors:", output.errors);
    }
    process.exit(1);
}

const contracts = output.contracts['Campaign.sol'];

fs.mkdirSync(buildPath);

for (let contract in contracts) {
    fs.writeFileSync(
        path.resolve(buildPath, `${contract}.json`),
        JSON.stringify(contracts[contract], null, 2)
    );
}
