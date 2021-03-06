const assert = require('assert'); // standard library, for making assertions about tests. 
const ganache = require('ganache-cli'); //requiring ganache
const Web3 = require('web3'); //uppercase Web3 notice this, is a constructor used to create instances of the web3 library , think of it as the class of Web3

//updating lines for web3 breaking changes
const provider = ganache.provider();
const web3 = new Web3(provider); //instance of Web3 and connect to local test network (ganache)

const { interface, bytecode } = require('../compile'); //import the interface and bytecode of the contract

/* class Car {
    park(){
        return "stopped";
    }

    drive(){
        return "vroom";
    }
}

let car; // fixes scope problem with 'car' variable, need to define it as a 'let' variable before the tests so we can redefine the variable within the beforeEach 

beforeEach(()=>{ // does common initialization code before tests run
  car = new Car();  
});

describe('Car', ()=>{ //groups together 'it' statements to test Car class and methods
    it('can park', ()=>{
        //write our actual test setup and assertion logic here
        //use Assert library that is a part of the Node standard library 
        assert.equal(car.park(), 'stopped'); // testing to see if the value returned by car.park() is 'stopped'

    });//first argument is the string that describes the purpose of the test we're going to write
    it('can drive', () =>{
        assert.equal(car.drive(), 'vroom');
    })
}); // first string passed in is just something to see what is on our testing report so that we can know what we're testing
*/

//fetching Ganache accounts
let accounts;
let inbox;

INITIAL_STRING = 'Hi there!';

beforeEach(async () =>{ //add async
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts(); //every function that we call with web3 is async in nature, always returning a promise

    // Use one of those account to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] })//initial argument is the bytecode of the contract, second argument
    .send({ from: accounts[0], gas: '1000000' }) //specifies the account from which to deploy and gas to use for the deployment of the contract

    //ADD THIS ONE LINE RIGHT HERE!!!
    inbox.setProvider(provider)
})

describe('Inbox', () =>{
    it('deploys a contract', () =>{
        assert.ok(inbox.options.address); // ok is a part of the node standard library, makes assertion that it is a value that it exists.  looking up if it exists then the contract has been successfully deployed. if it is a truthy value, then the test will pass because a string is a truthy value. 
    });
    it('has a default message', async () =>{
        const message = await inbox.methods.message().call(); //instance of the contract, property called methods (object that contains all the public functions that exist within the contract), and call so that it is free to test and instantaneous, 1st set of parantheses is the method call, 2nd set of parentheses need to use call function, customizes exactly how the function gets called  
        assert.equal(message, INITIAL_STRING); 
    });

    it('can change the message', async () =>{
        await inbox.methods.setMessage('bye').send({from: accounts[0], gas: '1000000'});
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye');
    })
});