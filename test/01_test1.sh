#!/bin/bash
# ----------------------------------------------------------------------------------------------
# Testing the smart contract
#
# Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2017. The MIT Licence.
# ----------------------------------------------------------------------------------------------

MODE=${1:-test}

GETHATTACHPOINT=`grep ^IPCFILE= settings.txt | sed "s/^.*=//"`
PASSWORD=`grep ^PASSWORD= settings.txt | sed "s/^.*=//"`

DAOCASINOTOKENSOL=`grep ^DAOCASINOTOKENSOL= settings.txt | sed "s/^.*=//"`
DAOCASINOTOKENTEMPSOL=`grep ^DAOCASINOTOKENTEMPSOL= settings.txt | sed "s/^.*=//"`
DAOCASINOTOKENJS=`grep ^DAOCASINOTOKENJS= settings.txt | sed "s/^.*=//"`

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

printf "MODE                  = '$MODE'\n"
printf "GETHATTACHPOINT       = '$GETHATTACHPOINT'\n"
printf "PASSWORD              = '$PASSWORD'\n"
printf "DAOCASINOTOKENSOL     = '$DAOCASINOTOKENSOL'\n"
printf "DAOCASINOTOKENTEMPSOL = '$DAOCASINOTOKENTEMPSOL'\n"
printf "DAOCASINOTOKENJS      = '$DAOCASINOTOKENJS'\n"
printf "DEPLOYMENTDATA        = '$DEPLOYMENTDATA'\n"
printf "INCLUDEJS             = '$INCLUDEJS'\n"
printf "TEST1OUTPUT           = '$TEST1OUTPUT'\n"
printf "TEST1RESULTS          = '$TEST1RESULTS'\n"
printf "CURRENTTIME           = '$CURRENTTIME' '$CURRENTTIMES'\n"
printf "STARTTIME             = '$STARTTIME' '$STARTTIME_S'\n"
printf "ENDTIME               = '$ENDTIME' '$ENDTIME_S'\n"

# Make copy of SOL file and modify start and end times ---
`cp $DAOCASINOTOKENSOL $DAOCASINOTOKENTEMPSOL`

# --- Modify dates ---
#`perl -pi -e "s/STARTDATE \= 1498741200;.*$/STARTDATE \= $STARTTIME; \/\/ $STARTTIME_S/" $DAOCASINOTOKENTEMPSOL`
#`perl -pi -e "s/ENDDATE \= STARTDATE \+ 28 days;.*$/ENDDATE \= STARTDATE \+ 5 minutes;/" $DAOCASINOTOKENTEMPSOL`
#`perl -pi -e "s/CAP \= 84417 ether;.*$/CAP \= 100 ether;/" $DAOCASINOTOKENTEMPSOL`

DIFFS1=`diff $DAOCASINOTOKENSOL $DAOCASINOTOKENTEMPSOL`
echo "--- Differences $DAOCASINOTOKENSOL $DAOCASINOTOKENTEMPSOL ---"
echo "$DIFFS1"

echo "var dctOutput=`solc --optimize --combined-json abi,bin,interface $DAOCASINOTOKENTEMPSOL`;" > $DAOCASINOTOKENJS


geth --verbosity 3 attach $GETHATTACHPOINT << EOF | tee $TEST1OUTPUT
loadScript("$DAOCASINOTOKENJS");
loadScript("functions.js");

var dctAbi = JSON.parse(dctOutput.contracts["$DAOCASINOTOKENTEMPSOL:DaoCasinoToken"].abi);
var dctBin = "0x" + dctOutput.contracts["$DAOCASINOTOKENTEMPSOL:DaoCasinoToken"].bin;

console.log("DATA: dctAbi=" + JSON.stringify(dctAbi));

unlockAccounts("$PASSWORD");
printBalances();
console.log("RESULT: ");


// -----------------------------------------------------------------------------
var dctMessage = "Deploy Token Contract";
// -----------------------------------------------------------------------------
console.log("RESULT: " + dctMessage);
var dctContract = web3.eth.contract(dctAbi);
console.log(JSON.stringify(dctContract));
var dctTx = null;
var dctAddress = null;

var dct = dctContract.new({from: contractOwnerAccount, data: dctBin, gas: 6000000},
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        dctTx = contract.transactionHash;
      } else {
        dctAddress = contract.address;
        addAccount(dctAddress, "BET Token Contract");
        addDctContractAddressAndAbi(dctAddress, dctAbi);
        addTokenContractAddressAndAbi(dctAddress, dctAbi);
        console.log("DATA: dctAddress=" + dctAddress);
      }
    }
  }
);

while (txpool.status.pending > 0) {
}

printTxData("dctAddress=" + dctAddress, dctTx);
printBalances();
failIfGasEqualsGasUsed(dctTx, dctMessage);
printDctContractDetails();
console.log("RESULT: ");


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
