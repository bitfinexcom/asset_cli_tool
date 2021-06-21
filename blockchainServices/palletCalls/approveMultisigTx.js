const inquirer = require("inquirer");
const { getKeypair, getApi, signAndSend } = require("../setup");
const { blake2AsHex } = require('@polkadot/util-crypto');

const question = [
  {
	type: "input",
	name: "multisigAccount",
	message: "input multisig account",
	default: '5DjYJStmdZ2rcqXbXGX7TW85JsrW6uG4y9MUcLq2BoPMpRA7',
  },
  {
	type: "input",
	name: "call",
	message: "the function to call",
	default: "mint",
  },
  {
	type: "input",
	name: "promptArguments",
	message: "an array of arguments",
	default: '["1", "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "1"]',
  },
  {
	  type: 'input',
	  name: 'admin',
	  message: 'sender of the transaction',
	  default: '//Bob'
  },
  {
	  type: "input",
	  name: "threshold",
	  message: "m of n",
	  default: "2",
	},
	{
	  type: "input",
	  name: "otherSignatories",
	  message: "other signatories array",
	  default: '["5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y", "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"]',
	},
];

const approveMultisigTx = async (calls) => {
	const { multisigAccount, call, promptArguments, threshold, otherSignatories, admin } = await inquirer.prompt(question);
	const arguments = JSON.parse(promptArguments)
	console.log({multisigAccount, call, arguments})
	const api = await getApi();
	const sender = getKeypair(admin);
	const preppedTx = await calls[`${call}`](api, arguments)
	const txToSend = preppedTx.toHex()
	const paymentInfo = await preppedTx.paymentInfo(sender)
	console.log(blake2AsHex(txToSend))
	console.log(paymentInfo.weight.toString())
	// console.log(threshold, JSON.parse(otherSignatories), txToSend, false, 0)
	const multisigCall = await api.query.multisig.multisigs(multisigAccount, blake2AsHex(txToSend))
	console.log({multisigCall: multisigCall.toJSON()})
	const tx = api.tx.multisig.asMulti(threshold, JSON.parse(otherSignatories), multisigCall.toJSON().when, txToSend, false, paymentInfo.weight)
	await signAndSend(tx, api, sender)
  };
  
  module.exports = {
	approveMultisigTx,
  };
  
