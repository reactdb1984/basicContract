const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("Web3");

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require("../compile");
let accounts;
let inbox;
const INIAL_STRING = "Hi there!";
beforeEach(async () => {
  // Get a list of all acounts

  // Use one of these acounts to test the contract

  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INIAL_STRING] })
    .send({ from: accounts[0], gas: "1000000" });
  inbox.setProvider(provider);
});
describe("Inbox", () => {
  it("deploys a contract", () => {
    assert.ok(inbox.options.address);
  });
  it("has a default message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hi there!");
  });
  it("can change the message", async () => {
    await inbox.methods.setMessage("bye").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye'); 
  });
});
