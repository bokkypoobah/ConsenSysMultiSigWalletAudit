#!/bin/bash
# ----------------------------------------------------------------------------------------------
# Testing the smart contract
#
# Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2017. The MIT Licence.
# ----------------------------------------------------------------------------------------------

MODE=${1:-test}

GETHATTACHPOINT=`grep ^IPCFILE= settings.txt | sed "s/^.*=//"`
PASSWORD=`grep ^PASSWORD= settings.txt | sed "s/^.*=//"`

CONTRACTSDIR=`grep ^CONTRACTSDIR= settings.txt | sed "s/^.*=//"`

WALLETSOL=`grep ^WALLETSOL= settings.txt | sed "s/^.*=//"`
WALLETTEMPSOL=`grep ^WALLETTEMPSOL= settings.txt | sed "s/^.*=//"`
WALLETJS=`grep ^WALLETJS= settings.txt | sed "s/^.*=//"`

DEPLOYMENTDATA=`grep ^DEPLOYMENTDATA= settings.txt | sed "s/^.*=//"`

INCLUDEJS=`grep ^INCLUDEJS= settings.txt | sed "s/^.*=//"`
TEST1OUTPUT=`grep ^TEST1OUTPUT= settings.txt | sed "s/^.*=//"`
TEST1RESULTS=`grep ^TEST1RESULTS= settings.txt | sed "s/^.*=//"`

CURRENTTIME=`date +%s`
CURRENTTIMES=`date -r $CURRENTTIME -u`

BLOCKSINDAY=10

if [ "$MODE" == "dev" ]; then
  # Start time now
  STARTTIME=`echo "$CURRENTTIME" | bc`
else
  # Start time 1m 10s in the future
  STARTTIME=`echo "$CURRENTTIME+75" | bc`
fi
STARTTIME_S=`date -r $STARTTIME -u`
ENDTIME=`echo "$CURRENTTIME+60*3" | bc`
ENDTIME_S=`date -r $ENDTIME -u`

printf "MODE            = '$MODE'\n" | tee $TEST1OUTPUT
printf "GETHATTACHPOINT = '$GETHATTACHPOINT'\n" | tee -a $TEST1OUTPUT
printf "PASSWORD        = '$PASSWORD'\n" | tee -a $TEST1OUTPUT
printf "CONTRACTSDIR    = '$CONTRACTSDIR'\n" | tee -a $TEST1OUTPUT
printf "WALLETSOL       = '$WALLETSOL'\n" | tee -a $TEST1OUTPUT
printf "WALLETTEMPSOL   = '$WALLETTEMPSOL'\n" | tee -a $TEST1OUTPUT
printf "WALLETJS        = '$WALLETJS'\n" | tee -a $TEST1OUTPUT
printf "DEPLOYMENTDATA  = '$DEPLOYMENTDATA'\n" | tee -a $TEST1OUTPUT
printf "INCLUDEJS       = '$INCLUDEJS'\n" | tee -a $TEST1OUTPUT
printf "TEST1OUTPUT     = '$TEST1OUTPUT'\n" | tee -a $TEST1OUTPUT
printf "TEST1RESULTS    = '$TEST1RESULTS'\n" | tee -a $TEST1OUTPUT
printf "CURRENTTIME     = '$CURRENTTIME' '$CURRENTTIMES'\n" | tee -a $TEST1OUTPUT
printf "STARTTIME       = '$STARTTIME' '$STARTTIME_S'\n" | tee -a $TEST1OUTPUT
printf "ENDTIME         = '$ENDTIME' '$ENDTIME_S'\n" | tee -a $TEST1OUTPUT

# Make copy of SOL file and modify start and end times ---
`cp modifiedContracts/$WALLETSOL $WALLETTEMPSOL`

# --- Modify any parameters? ---
#`perl -pi -e "s/STARTDATE \= 1498741200;.*$/STARTDATE \= $STARTTIME; \/\/ $STARTTIME_S/" $DAOCASINOTOKENTEMPSOL`
#`perl -pi -e "s/ENDDATE \= STARTDATE \+ 28 days;.*$/ENDDATE \= STARTDATE \+ 5 minutes;/" $DAOCASINOTOKENTEMPSOL`
#`perl -pi -e "s/CAP \= 84417 ether;.*$/CAP \= 100 ether;/" $DAOCASINOTOKENTEMPSOL`

DIFFS1=`diff $CONTRACTSDIR/$WALLETSOL $WALLETTEMPSOL`
echo "--- Differences $CONTRACTSDIR/$WALLETSOL $WALLETTEMPSOL ---"
echo "$DIFFS1"

echo "var walletOutput=`solc --optimize --combined-json abi,bin,interface $WALLETTEMPSOL`;" > $WALLETJS

geth --verbosity 3 attach $GETHATTACHPOINT << EOF | tee -a $TEST1OUTPUT
loadScript("$WALLETJS");
loadScript("functions.js");

var walletAbi = JSON.parse(walletOutput.contracts["$WALLETTEMPSOL:MultiSigWallet"].abi);
var walletBin = "0x" + walletOutput.contracts["$WALLETTEMPSOL:MultiSigWallet"].bin;

console.log("DATA: walletAbi=" + JSON.stringify(walletAbi));

unlockAccounts("$PASSWORD");
printBalances();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var deployWalletMessage = "Deploy Wallet Contract - 1 Of 2 Signatures Required";
// -----------------------------------------------------------------------------
console.log("RESULT: " + deployWalletMessage);
var walletContract = web3.eth.contract(walletAbi);
console.log(JSON.stringify(walletContract));
var walletTx = null;
var walletAddress = null;

var wallet = walletContract.new([multisigOwner1, multisigOwner2], 1, {from: contractOwnerAccount, data: walletBin, gas: 6000000},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        walletTx = contract.transactionHash;
      } else {
        walletAddress = contract.address;
        addAccount(walletAddress, "Wallet Contract");
        addWalletContractAddressAndAbi(walletAddress, walletAbi);
        console.log("DATA: walletAddress=" + walletAddress);
      }
    }
  }
);

while (txpool.status.pending > 0) {
}

printTxData("walletAddress=" + walletAddress, walletTx);
printBalances();
failIfGasEqualsGasUsed(walletTx, deployWalletMessage);
printWalletContractDetails();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var sendEthMessage = "Send 1,000 ETH From Contract Owner To Multisig";
// -----------------------------------------------------------------------------
console.log("RESULT: " + sendEthMessage);
var sendEthTx = eth.sendTransaction({from: contractOwnerAccount, to: walletAddress, value: web3.toWei(1000, "ether"), gas: 400000});
while (txpool.status.pending > 0) {
}
printTxData("sendEthTx", sendEthTx);
printBalances();
failIfGasEqualsGasUsed(sendEthTx, sendEthMessage);
printWalletContractDetails();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var multisigSendEthMessage = "Multisig Send 1 ETH From Multisig To Account 6";
// -----------------------------------------------------------------------------
console.log("RESULT: " + multisigSendEthMessage);
var multisigSendEth1Tx = wallet.submitTransaction(account6, web3.toWei(1, "ether"), "", {from: contractOwnerAccount, gas: 400000});
var multisigSendEth2Tx = wallet.submitTransaction(account7, web3.toWei(1, "ether"), "", {from: multisigOwner1, gas: 400000});
while (txpool.status.pending > 0) {
}
printTxData("multisigSendEth1Tx", multisigSendEth1Tx);
printTxData("multisigSendEth2Tx", multisigSendEth2Tx);
printBalances();
passIfGasEqualsGasUsed(multisigSendEth1Tx, multisigSendEthMessage + " FAIL - ContractOwnerAccount -> Account6");
failIfGasEqualsGasUsed(multisigSendEth2Tx, multisigSendEthMessage + " PASS - MultisigAccount1 -> Account7");
printWalletContractDetails();
console.log("RESULT: ");

var addOwnerSig = "7065cb48";
var removeOwnerSig = "173825d9";

// -----------------------------------------------------------------------------
var multisigAddOwnerMessage = "Multisig Add Owner";
// -----------------------------------------------------------------------------
console.log("RESULT: " + multisigAddOwnerMessage);
var addOwner1 = "0x" + addOwnerSig + "000000000000000000000000" + "a44a08d3f6933c69212114bb66e2df1813651844";
var addOwner2 = "0x" + addOwnerSig + "000000000000000000000000" + "a55a151eb00fded1634d27d1127b4be4627079ea";
var multisigAddOwner1Tx = wallet.submitTransaction(walletAddress, 0, addOwner1, {from: contractOwnerAccount, gas: 400000});
var multisigAddOwner2Tx = wallet.submitTransaction(walletAddress, 0, addOwner2, {from: multisigOwner1, gas: 400000});
while (txpool.status.pending > 0) {
}
printTxData("multisigAddOwner1Tx", multisigAddOwner1Tx);
printTxData("multisigAddOwner2Tx", multisigAddOwner2Tx);
printBalances();
passIfGasEqualsGasUsed(multisigAddOwner1Tx, multisigAddOwnerMessage + " FAIL - From ContractOwnerAccount, Not Owner - Add ac4");
failIfGasEqualsGasUsed(multisigAddOwner2Tx, multisigAddOwnerMessage + " PASS - From MultisigAccount1 - Add ac5");
printWalletContractDetails();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var multisigRemoveOwnerMessage = "Multisig Remove Owner";
// -----------------------------------------------------------------------------
console.log("RESULT: " + multisigRemoveOwnerMessage);
var removeOwner1 = "0x" + removeOwnerSig + "000000000000000000000000" + "a33a6c312d9ad0e0f2e95541beed0cc081621fd0";
var removeOwner2 = "0x" + removeOwnerSig + "000000000000000000000000" + "a55a151eb00fded1634d27d1127b4be4627079ea";
var multisigRemoveOwner1Tx = wallet.submitTransaction(walletAddress, 0, removeOwner1, {from: contractOwnerAccount, gas: 400000});
var multisigRemoveOwner2Tx = wallet.submitTransaction(walletAddress, 0, removeOwner2, {from: multisigOwner1, gas: 400000});
while (txpool.status.pending > 0) {
}
printTxData("multisigRemoveOwner1Tx", multisigRemoveOwner1Tx);
printTxData("multisigRemoveOwner2Tx", multisigRemoveOwner2Tx);
printBalances();
passIfGasEqualsGasUsed(multisigRemoveOwner1Tx, multisigRemoveOwnerMessage + " FAIL - From ContractOwnerAccount, Not Owner - Remov ac3");
failIfGasEqualsGasUsed(multisigRemoveOwner2Tx, multisigRemoveOwnerMessage + " PASS - From MultisigAccount1 - Remove ac5");
printWalletContractDetails();
console.log("RESULT: ");


exit;

// -----------------------------------------------------------------------------
var fillMessage = "Fill Token Balances";
// -----------------------------------------------------------------------------
console.log("RESULT: " + fillMessage);
var D160 = new BigNumber("10000000000000000000000000000000000000000", 16);
var balances = [];
var amount = new BigNumber("100000").shift(18);
var addressNum = new BigNumber(account3.substring(2), 16);
var v = D160.mul(amount).add(addressNum);
balances.push(v.toString(10));
amount = new BigNumber("10000").shift(18);
addressNum = new BigNumber(account4.substring(2), 16);
v = D160.mul(amount).add(addressNum);
balances.push(v.toString(10));
var fillTx = dct.fill(balances, {from: contractOwnerAccount, gas: 400000});
while (txpool.status.pending > 0) {
}
printTxData("fillTx", fillTx);
printBalances();
failIfGasEqualsGasUsed(fillTx, fillMessage);
printDctContractDetails();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var sealMessage = "Seal Contract";
// -----------------------------------------------------------------------------
console.log("RESULT: " + sealMessage);
var sealTx = dct.seal({from: contractOwnerAccount, gas: 400000});
while (txpool.status.pending > 0) {
}
printTxData("sealTx", sealTx);
printBalances();
failIfGasEqualsGasUsed(sealTx, sealMessage);
printDctContractDetails();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var canTransferMessage = "Can Move Tokens";
console.log("RESULT: " + canTransferMessage);
var canTransfer1Tx = dct.transfer(account5, "1000000000000", {from: account3, gas: 100000});
var canTransfer2Tx = dct.approve(account6,  "30000000000000000", {from: account4, gas: 100000});
while (txpool.status.pending > 0) {
}
var canTransfer3Tx = dct.transferFrom(account4, account7, "30000000000000000", {from: account6, gas: 100000});
while (txpool.status.pending > 0) {
}
printTxData("canTransfer1Tx", canTransfer1Tx);
printTxData("canTransfer2Tx", canTransfer2Tx);
printTxData("canTransfer3Tx", canTransfer3Tx);
printBalances();
failIfGasEqualsGasUsed(canTransfer1Tx, canTransferMessage + " - transfer 0.000001 BET ac3 -> ac5. CHECK for movement");
failIfGasEqualsGasUsed(canTransfer2Tx, canTransferMessage + " - ac4 approve 0.03 BET ac6");
failIfGasEqualsGasUsed(canTransfer3Tx, canTransferMessage + " - ac6 transferFrom 0.03 BET ac4 -> ac7. CHECK for movement");
printDctContractDetails();
console.log("RESULT: ");

EOF
grep "DATA: " $TEST1OUTPUT | sed "s/DATA: //" > $DEPLOYMENTDATA
cat $DEPLOYMENTDATA
grep "RESULT: " $TEST1OUTPUT | sed "s/RESULT: //" > $TEST1RESULTS
cat $TEST1RESULTS
