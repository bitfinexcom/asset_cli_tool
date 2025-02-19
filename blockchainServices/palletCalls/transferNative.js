const {
  getKeypair,
  getApi,
  signAndSend,
  ledgerSignAndSend,
} = require("../setup");
const inquirer = require("inquirer");

const question = [
  {
    type: "input",
    name: "from",
    message: "sending from mnemonic type ledger for ledger",
    default: "//Alice",
  },
  {
    type: "input",
    name: "to",
    message: "send to address",
    default: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
  },
  {
    type: "input",
    name: "amount",
    message: "Input amount (will be multiplied by decimals)",
    default: "1",
  },
];

const transferNative = async (calls) => {
  const { to, amount, from } = await inquirer.prompt(question);
  const api = await getApi();
  const adjustedAmount = amount * 1e12;
  const tx = await calls.transferNative(api, [to, adjustedAmount]);
  if (from === "ledger") {
    await ledgerSignAndSend(tx, api);
  } else {
    const sender = getKeypair(from);
    await signAndSend(tx, api, sender);
  }
};

module.exports = {
  transferNative,
};
