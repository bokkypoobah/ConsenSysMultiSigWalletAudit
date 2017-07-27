// Jun 12 2017
var ethPriceUSD = 380.39;

// -----------------------------------------------------------------------------
// Accounts
// -----------------------------------------------------------------------------
var accounts = [];
var accountNames = {};

addAccount(eth.accounts[0], "Account #0 - Miner");
addAccount(eth.accounts[1], "Account #1 - Contract Owner");
addAccount(eth.accounts[2], "Account #2 - Multisig Owner 1");
addAccount(eth.accounts[3], "Account #3 - Multisig Owner 2");
addAccount(eth.accounts[4], "Account #4 - Multisig Owner 3");
addAccount(eth.accounts[5], "Account #5 - Multisig Owner 4");
addAccount(eth.accounts[6], "Account #6");
addAccount(eth.accounts[7], "Account #7");
addAccount(eth.accounts[8], "Account #8");

var minerAccount = eth.accounts[0];
var contractOwnerAccount = eth.accounts[1];
var multisigOwner1 = eth.accounts[2];
var multisigOwner2 = eth.accounts[3];
var multisigOwner3 = eth.accounts[4];
var multisigOwner4 = eth.accounts[5];
var account6 = eth.accounts[6];
var account7 = eth.accounts[7];
var account8 = eth.accounts[8];

var baseBlock = eth.blockNumber;

function unlockAccounts(password) {
  for (var i = 0; i < eth.accounts.length; i++) {
    personal.unlockAccount(eth.accounts[i], password, 100000);
  }
}

function addAccount(account, accountName) {
  accounts.push(account);
  accountNames[account] = accountName;
}


// -----------------------------------------------------------------------------
// Token Contract
// -----------------------------------------------------------------------------
var tokenContractAddress = null;
var tokenContractAbi = null;

function addTokenContractAddressAndAbi(address, tokenAbi) {
  tokenContractAddress = address;
  tokenContractAbi = tokenAbi;
}


// -----------------------------------------------------------------------------
// Account ETH and token balances
// -----------------------------------------------------------------------------
function printBalances() {
  var token = tokenContractAddress == null || tokenContractAbi == null ? null : web3.eth.contract(tokenContractAbi).at(tokenContractAddress);
  var decimals = token == null ? 18 : token.decimals();
  var i = 0;
  var totalTokenBalance = new BigNumber(0);
  console.log("RESULT:  # Account                                             EtherBalanceChange                          Token Name");
  console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ---------------------------");
  accounts.forEach(function(e) {
    var etherBalanceBaseBlock = eth.getBalance(e, baseBlock);
    var etherBalance = web3.fromWei(eth.getBalance(e).minus(etherBalanceBaseBlock), "ether");
    var tokenBalance = token == null ? new BigNumber(0) : token.balanceOf(e).shift(-decimals);
    totalTokenBalance = totalTokenBalance.add(tokenBalance);
    console.log("RESULT: " + pad2(i) + " " + e  + " " + pad(etherBalance) + " " + padToken(tokenBalance, decimals) + " " + accountNames[e]);
    i++;
  });
  console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ---------------------------");
  console.log("RESULT:                                                                           " + padToken(totalTokenBalance, decimals) + " Total Token Balances");
  console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ---------------------------");
  console.log("RESULT: ");
}

function pad2(s) {
  var o = s.toFixed(0);
  while (o.length < 2) {
    o = " " + o;
  }
  return o;
}

function pad(s) {
  var o = s.toFixed(18);
  while (o.length < 27) {
    o = " " + o;
  }
  return o;
}

function padToken(s, decimals) {
  var o = s.toFixed(decimals);
  var l = parseInt(decimals)+12;
  while (o.length < l) {
    o = " " + o;
  }
  return o;
}


// -----------------------------------------------------------------------------
// Transaction status
// -----------------------------------------------------------------------------
function printTxData(name, txId) {
  var tx = eth.getTransaction(txId);
  var txReceipt = eth.getTransactionReceipt(txId);
  var gasPrice = tx.gasPrice;
  var gasCostETH = tx.gasPrice.mul(txReceipt.gasUsed).div(1e18);
  var gasCostUSD = gasCostETH.mul(ethPriceUSD);
  console.log("RESULT: " + name + " gas=" + tx.gas + " gasUsed=" + txReceipt.gasUsed + " costETH=" + gasCostETH +
    " costUSD=" + gasCostUSD + " @ ETH/USD=" + ethPriceUSD + " gasPrice=" + gasPrice + " block=" + 
    txReceipt.blockNumber + " txId=" + txId);
  var input = tx.input;
  if (input.length >= 10 && input.length < 500) {
    var methodId = input.substring(0, 10);
    var data = input.substring(10);
    console.log("RESULT: methodId: " + methodId);
    // console.log("RESULT: data    : " + data);
    if (data.length >= 64) {
      console.log("RESULT: data 0  : " + data.substring(0, 64));
    }
    if (data.length >= 64+64) {
      console.log("RESULT: data 1  : " + data.substring(0+64, 64+64));
    }
    if (data.length >= 64+64+64) {
      console.log("RESULT: data 2  : " + data.substring(0+64+64, 64+64+64));
    }
    if (data.length >= 64+64+64+64) {
      console.log("RESULT: data 3  : " + data.substring(0+64+64+64, 64+64+64+64));
    }
    if (data.length >= 64+64+64+64+64) {
      console.log("RESULT: data 4  : " + data.substring(0+64+64+64+64, 64+64+64+64+64));
    }
    if (data.length >= 64+64+64+64+64+64) {
      console.log("RESULT: data 5  : " + data.substring(0+64+64+64+64+64, 64+64+64+64+64+64));
    }
    if (data.length >= 64+64+64+64+64+64+64) {
      console.log("RESULT: data 6  : " + data.substring(0+64+64+64+64+64+64, 64+64+64+64+64+64+64));
    }
    if (data.length >= 64+64+64+64+64+64+64+64) {
      console.log("RESULT: data 7+ : " + data.substring(0+64+64+64+64+64+64+64));
    }
  }
}

function assertEtherBalance(account, expectedBalance) {
  var etherBalance = web3.fromWei(eth.getBalance(account), "ether");
  if (etherBalance == expectedBalance) {
    console.log("RESULT: OK " + account + " has expected balance " + expectedBalance);
  } else {
    console.log("RESULT: FAILURE " + account + " has balance " + etherBalance + " <> expected " + expectedBalance);
  }
}

function gasEqualsGasUsed(tx) {
  var gas = eth.getTransaction(tx).gas;
  var gasUsed = eth.getTransactionReceipt(tx).gasUsed;
  return (gas == gasUsed);
}

function failIfGasEqualsGasUsed(tx, msg) {
  var gas = eth.getTransaction(tx).gas;
  var gasUsed = eth.getTransactionReceipt(tx).gasUsed;
  if (gas == gasUsed) {
    console.log("RESULT: FAIL " + msg);
    return 0;
  } else {
    console.log("RESULT: PASS " + msg);
    return 1;
  }
}

function passIfGasEqualsGasUsed(tx, msg) {
  var gas = eth.getTransaction(tx).gas;
  var gasUsed = eth.getTransactionReceipt(tx).gasUsed;
  if (gas == gasUsed) {
    console.log("RESULT: PASS " + msg);
    return 1;
  } else {
    console.log("RESULT: FAIL " + msg);
    return 0;
  }
}

function failIfGasEqualsGasUsedOrContractAddressNull(contractAddress, tx, msg) {
  if (contractAddress == null) {
    console.log("RESULT: FAIL " + msg);
    return 0;
  } else {
    var gas = eth.getTransaction(tx).gas;
    var gasUsed = eth.getTransactionReceipt(tx).gasUsed;
    if (gas == gasUsed) {
      console.log("RESULT: FAIL " + msg);
      return 0;
    } else {
      console.log("RESULT: PASS " + msg);
      return 1;
    }
  }
}


//-----------------------------------------------------------------------------
// Wallet Contract
//-----------------------------------------------------------------------------
var walletContractAddress = null;
var walletContractAbi = null;

function addWalletContractAddressAndAbi(address, abi) {
  walletContractAddress = address;
  walletContractAbi = abi;
}

var walletFromBlock = 0;
function printWalletContractDetails() {
  // console.log("RESULT: walletContractAddress=" + walletContractAddress);
  // console.log("RESULT: walletContractAbi=" + JSON.stringify(walletContractAbi));
  if (walletContractAddress != null && walletContractAbi != null) {
    var contract = eth.contract(walletContractAbi).at(walletContractAddress);
    // var decimals = contract.decimals();
    console.log("RESULT: wallet.MAX_OWNER_COUNT=" + contract.MAX_OWNER_COUNT());
    console.log("RESULT: wallet.required=" + contract.required());
    console.log("RESULT: wallet.transactionCount[pending=n,executed=n] - [n,n]=" + contract.getTransactionCount(false, false) +
        " [y,n]=" + contract.getTransactionCount(true, false) +
        " [n,y]=" + contract.getTransactionCount(false, true) +
        " [y,y]=" + contract.getTransactionCount(true, true));
    console.log("RESULT: wallet.getOwners=" + contract.getOwners());
    var ownersLength = contract.getOwnersLength();
    var i;
    for (i = 0; i < ownersLength; i++) {
      console.log("RESULT: owner[" + i + "]=" + contract.owners(i));
    }
    for (i = 0; i < contract.transactionCount(); i++) {
      console.log("RESULT: tx[" + i + "]=" + contract.transactions(i));
    }
//    console.log("RESULT: wallet.decimals=" + decimals);
//    console.log("RESULT: wallet.totalSupply=" + contract.totalSupply().shift(-18));
//    var startDate = contract.STARTDATE();
//    console.log("RESULT: wallet.totalEthers=" + contract.totalEthers().shift(-18));
//    console.log("RESULT: wallet.CAP=" + contract.CAP().shift(-18));
//    console.log("RESULT: wallet.STARTDATE=" + startDate + " " + new Date(startDate * 1000).toUTCString()  + 
//        " / " + new Date(startDate * 1000).toGMTString());
//    var endDate = contract.ENDDATE();
//    console.log("RESULT: wallet.ENDDATE=" + endDate + " " + new Date(endDate * 1000).toUTCString()  + 
//        " / " + new Date(endDate * 1000).toGMTString());

    var latestBlock = eth.blockNumber;

    var submissionEvent = contract.Submission({}, { fromBlock: walletFromBlock, toBlock: latestBlock });
    i = 0;
    submissionEvent.watch(function (error, result) {
      console.log("RESULT: Submission " + i++ + " #" + result.blockNumber + " transactionId=" + result.args.transactionId);
    });
    submissionEvent.stopWatching();

    var confirmationEvent = contract.Confirmation({}, { fromBlock: walletFromBlock, toBlock: latestBlock });
    i = 0;
    confirmationEvent.watch(function (error, result) {
      console.log("RESULT: Confirmation " + i++ + " #" + result.blockNumber + " sender=" + result.args.sender + 
        " transactionId=" + result.args.transactionId);
    });
    confirmationEvent.stopWatching();

    var revocationEvent = contract.Revocation({}, { fromBlock: walletFromBlock, toBlock: latestBlock });
    i = 0;
    revocationEvent.watch(function (error, result) {
      console.log("RESULT: Revocation " + i++ + " #" + result.blockNumber + " sender=" + result.args.sender + 
        " transactionId=" + result.args.transactionId);
    });
    revocationEvent.stopWatching();

    var executionEvent = contract.Execution({}, { fromBlock: walletFromBlock, toBlock: latestBlock });
    i = 0;
    executionEvent.watch(function (error, result) {
      console.log("RESULT: Execution " + i++ + " #" + result.blockNumber + " transactionId=" + result.args.transactionId);
    });
    executionEvent.stopWatching();

    var executionFailureEvent = contract.ExecutionFailure({}, { fromBlock: walletFromBlock, toBlock: latestBlock });
    i = 0;
    executionFailureEvent.watch(function (error, result) {
      console.log("RESULT: ExecutionFailure " + i++ + " #" + result.blockNumber + " transactionId=" + result.args.transactionId);
    });
    executionFailureEvent.stopWatching();

    var depositEvent = contract.Deposit({}, { fromBlock: walletFromBlock, toBlock: latestBlock });
    i = 0;
    depositEvent.watch(function (error, result) {
      console.log("RESULT: Deposit " + i++ + " #" + result.blockNumber + " sender=" + result.args.sender +
          " value=" + result.args.value.shift(-18));
    });
    depositEvent.stopWatching();

    var ownerAdditionEvent = contract.OwnerAddition({}, { fromBlock: walletFromBlock, toBlock: latestBlock });
    i = 0;
    ownerAdditionEvent.watch(function (error, result) {
      console.log("RESULT: OwnerAddition " + i++ + " #" + result.blockNumber + " owner=" + result.args.owner);
    });
    ownerAdditionEvent.stopWatching();

    var ownerRemovalEvent = contract.OwnerRemoval({}, { fromBlock: walletFromBlock, toBlock: latestBlock });
    i = 0;
    ownerRemovalEvent.watch(function (error, result) {
      console.log("RESULT: OwnerRemoval " + i++ + " #" + result.blockNumber + " owner=" + result.args.owner);
    });
    ownerRemovalEvent.stopWatching();

    var requirementChangeEvent = contract.RequirementChange({}, { fromBlock: walletFromBlock, toBlock: latestBlock });
    i = 0;
    requirementChangeEvent.watch(function (error, result) {
      console.log("RESULT: RequirementChange " + i++ + " #" + result.blockNumber + " required=" + result.args.required);
    });
    requirementChangeEvent.stopWatching();

    walletFromBlock = latestBlock + 1;
  }
}
