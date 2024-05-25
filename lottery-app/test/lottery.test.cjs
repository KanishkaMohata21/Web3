const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const { compiledContent } = require('../compile.cjs'); 

const provider = ganache.provider();
const web3 = new Web3(provider);

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    console.log('Bytecode:', compiledContent.bytecode);
    console.log('ABI:', compiledContent.interface);

    lottery = await new web3.eth.Contract(JSON.parse(compiledContent.interface))
        .deploy({ data: compiledContent.bytecode })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Lottery Contract', () => {
    it('deploys a contract', async () => {
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getAllPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });
    it('allows multiple account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getAllPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });
    it('requires minimum amount of ether',async()=>{
        try{
            await lottery.methods.enter().send({
                from:accounts[0],
                value:200
            })
        }catch(e){
            assert(e)
        }
    })
    it('pick winner can be called by manager only',async()=>{
        try{
            await lottery.methods.pickWinner().send({
                from:accounts[1],
            });
        }catch(e){
            assert(e);
        }
    })
    it('sends money to the winner and resets the player aaray',async()=>{
        await lottery.methods.enter().send({
            from:accounts[0],
            value: web3.utils.toWei('2', 'ether')
        })
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        console.log(`initialbalance ${initialBalance}`);
        await lottery.methods.pickWinner().send({
            from:accounts[0]
        })
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        console.log(`finalBalance ${finalBalance}`);
        const difference = finalBalance - initialBalance;
        console.log(`difference ${difference}`);
        assert(difference > web3.utils.toWei('1.8','ether'))
    })
});
