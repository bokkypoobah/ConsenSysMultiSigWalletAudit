# ConsenSys MultiSig Wallet Audit

Status: Work in progress

The source code for [contracts/MultiSigWallet.sol](contracts/MultiSigWallet.sol) is the same as
[https://github.com/ConsenSys/MultiSigWallet/blob/e3240481928e9d2b57517bd192394172e31da487/contracts/solidity/MultiSigWallet.sol](https://github.com/ConsenSys/MultiSigWallet/blob/e3240481928e9d2b57517bd192394172e31da487/contracts/solidity/MultiSigWallet.sol),
with only the minimum solidity version statement upgraded from `pragma solidity 0.4.4;` to `pragma solidity ^0.4.11;`.

<br />

<hr />

## Table Of Contents

* [Bug Bounty](#bug-bounty)
  * [Rules And Rewards](#rules-and-rewards)
  * [The BokkyPooBah Hall Of Fame](#the-bokkypoobah-hall-of-fame)
* [Testing](#testing)
* [Code Review](#code-review)
* [Function Signatures](#function-signatures)

<br />

<hr />

## Bug Bounty

To try to avoid [Parity Multisig](https://github.com/bokkypoobah/ParityMultisigRecoveryReconciliation) type hacks, I am offering a bug bounty of up
to 20 ETH for any serious bugs found in this multisig.

I have also been told that Satoshi Fund will pay a bug bounty on this smart contract.

The bug bounty account is at [0x1ba18f569a3cbd97725153be727eae094a7b42f3](https://etherscan.io/address/0x1ba18f569a3cbd97725153be727eae094a7b42f3).

If you want to support the audit of this kind of public goods, any donations to the account above during the months of July to September 2017 will
go into this general bug bounty, and the bounties awarded will be increased.

This bug bounty is currently applicable to the following projects:

* Whitelisted Multisig Audit at [https://github.com/bokkypoobah/WhitelistedMultisigAudit](https://github.com/bokkypoobah/WhitelistedMultisigAudit)
* ConsenSys Multisig Audit (this project) at [https://github.com/bokkypoobah/ConsenSysMultiSigWalletAudit](https://github.com/bokkypoobah/ConsenSysMultiSigWalletAudit)

<br />

### Rules And Rewards

* Bugs that have already been submitted by another user or are already known to the BokkyPooBah are not eligible for bounty rewards.
* Public disclosure of a vulnerability makes it ineligible for a bounty.
* You can deploy the contracts on your private chain for bug hunting. Please respect the Ethereum Mainnet and Testnet and refrain from attacking them.
* The value of rewards paid out will depend on the severity of the bugs found. Determinations of this amount is at the sole and final discretion of the BokkyPooBah but the BokkyPooBah will be fair.

<br />

### The BokkyPooBah Hall Of Fame

If you do find any bugs in the above projects, you will enter [The BokkyPooBah Hall of Fame](https://github.com/bokkypoobah/TokenTrader/wiki/TokenTraderFactory-And-TokenSellerFactory-Bug-Bounty#the-bokkypoobah-hall-of-fame)

<br />

<hr />

## Testing

Testing being conducted in [test](test) (work in progress).

<br />

<hr />

## Code Review

Status: 1/2 way through.

Source code [contracts/WhitelistedMultisig.sol](contracts/WhitelistedMultisig.sol).

<br />

```javascript
// BK Ok
pragma solidity ^0.4.11;


/// @title Multisignature wallet - Allows multiple parties to agree on transactions before execution.
/// @author Stefan George - <stefan.george@consensys.net>
contract MultiSigWallet {

    // BK Ok
    uint constant public MAX_OWNER_COUNT = 50;

    // BK Next 9 Ok
    event Confirmation(address indexed sender, uint indexed transactionId);
    event Revocation(address indexed sender, uint indexed transactionId);
    event Submission(uint indexed transactionId);
    event Execution(uint indexed transactionId);
    event ExecutionFailure(uint indexed transactionId);
    event Deposit(address indexed sender, uint value);
    event OwnerAddition(address indexed owner);
    event OwnerRemoval(address indexed owner);
    event RequirementChange(uint required);

    // BK Ok - Mapping of TxId to Transaction
    mapping (uint => Transaction) public transactions;
    // BK Ok - Mapping of TxId -> Owner -> Confirmation Y/N
    mapping (uint => mapping (address => bool)) public confirmations;
    // BK Ok - Mapping of Owner -> Y/N
    mapping (address => bool) public isOwner;
    // BK Ok - Array of owners
    address[] public owners;
    // BK Ok - Number of required confirmations before a transaction can be executed for real
    uint public required;
    // BK Ok - Count of the number of transactions
    uint public transactionCount;

    // BK Ok
    struct Transaction {
        // BK Ok - Destination address for this transaction
        address destination;
        // BK Ok - Amount of ETH to send with this transaction
        uint value;
        // BK Ok - Any additional transaction data
        bytes data;
        // BK Ok - Has this transaction been executed
        bool executed;
    }

    modifier onlyWallet() {
        if (msg.sender != address(this))
            throw;
        _;
    }

    // BK Ok - Owner does not exist in the isOwner mapping, or the isOwner entry is set to false
    modifier ownerDoesNotExist(address owner) {
        // BK Ok
        if (isOwner[owner])
            // BK Ok
            throw;
        // BK Ok
        _;
    }

    // BK Ok - Check if owner exists in the isOwner mapping(owner => bool)
    modifier ownerExists(address owner) {
        // BK Ok
        if (!isOwner[owner])
            // BK Ok
            throw;
        // BK Ok
        _;
    }

    // BK Ok - Check if a transactionId exists
    modifier transactionExists(uint transactionId) {
        if (transactions[transactionId].destination == 0)
            throw;
        _;
    }

    modifier confirmed(uint transactionId, address owner) {
        if (!confirmations[transactionId][owner])
            throw;
        _;
    }

    // BK Ok - Check that the owner has not already confirmed the specified transaction
    modifier notConfirmed(uint transactionId, address owner) {
        // BK Ok
        if (confirmations[transactionId][owner])
            // BK Ok
            throw;
        // BK Ok
        _;
    }

    modifier notExecuted(uint transactionId) {
        if (transactions[transactionId].executed)
            throw;
        _;
    }

    // BK Ok - Checking address is not null
    modifier notNull(address _address) {
        // BK Ok
        if (_address == 0)
            // BK Ok
            throw;
        // BK Ok
        _;
    }

    // BK Ok
    modifier validRequirement(uint ownerCount, uint _required) {
        // BK Ok - Cannot have more than 50 owners
        if (   ownerCount > MAX_OWNER_COUNT
            // BK Ok - Number of signatures required must be less than or equal the number of owners
            //       - Otherwise you would have a wallet that cannot sign any transactions, including changing it's own parameters
            || _required > ownerCount
            // BK Ok - Must have at least one signature required
            || _required == 0
            // BK Ok - Must have at least one owner
            || ownerCount == 0)
            // BK Ok - Throw error if conditions not match
            throw;
        // BK Ok
        _;
    }

    /// @dev Fallback function allows to deposit ether.
    // BK OK - Receive ETH that will accumulate in this wallet contract
    function()
        // BK Ok
        payable
    {
        // BK Ok
        if (msg.value > 0)
            // BK Ok - Log event
            Deposit(msg.sender, msg.value);
    }

    /*
     * Public functions
     */
    /// @dev Contract constructor sets initial owners and required number of confirmations.
    /// @param _owners List of initial owners.
    /// @param _required Number of required confirmations.
    // BK Ok - Constructor. Will be executed when this contract is deployed, but the code won't be included in the blockchain
    function MultiSigWallet(address[] _owners, uint _required)
        public
        // BK Ok - _owners.length > 0 && _owners.length <= MAX_OWNER_COUNT && _required != 0 && _required <= owners.length
        validRequirement(_owners.length, _required)
    {
        for (uint i=0; i<_owners.length; i++) {
            // BK Ok - Checking for duplicate specified owner, or owner is 0x0
            if (isOwner[_owners[i]] || _owners[i] == 0)
                throw;
            // BK Ok - Save list of owners for duplicate check
            isOwner[_owners[i]] = true;
        }
        // BK Ok - Save list of owners
        owners = _owners;
        // BK Ok - Save list of confirmations required
        required = _required;
    }

    /// @dev Allows to add a new owner. Transaction has to be sent by wallet.
    /// @param owner Address of new owner.
    function addOwner(address owner)
        public
        // BK Ok - Only the wallet can execute this function
        onlyWallet
        // BK Ok - Owner does not exist in the isOwner mapping or the isOwner entry is set to false
        ownerDoesNotExist(owner)
        // BK Ok - Owner not null
        notNull(owner)
        // BK Ok - (_owners.length+1) > 0 && (_owners.length+1) <= MAX_OWNER_COUNT && _required != 0 && _required <= (owners.length+1)
        validRequirement(owners.length + 1, required)
    {
        // BK Ok - Set the isOwner entry to true
        isOwner[owner] = true;
        // BK Ok - Add the owner to the owners array
        owners.push(owner);
        // BK Ok - Log event
        OwnerAddition(owner);
    }

    /// @dev Allows to remove an owner. Transaction has to be sent by wallet.
    /// @param owner Address of owner.
    function removeOwner(address owner)
        public
        onlyWallet
        ownerExists(owner)
    {
        isOwner[owner] = false;
        for (uint i=0; i<owners.length - 1; i++)
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                break;
            }
        owners.length -= 1;
        if (required > owners.length)
            changeRequirement(owners.length);
        OwnerRemoval(owner);
    }

    /// @dev Allows to replace an owner with a new owner. Transaction has to be sent by wallet.
    /// @param owner Address of owner to be replaced.
    /// @param owner Address of new owner.
    function replaceOwner(address owner, address newOwner)
        public
        onlyWallet
        ownerExists(owner)
        ownerDoesNotExist(newOwner)
    {
        for (uint i=0; i<owners.length; i++)
            if (owners[i] == owner) {
                owners[i] = newOwner;
                break;
            }
        isOwner[owner] = false;
        isOwner[newOwner] = true;
        OwnerRemoval(owner);
        OwnerAddition(newOwner);
    }

    /// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
    /// @param _required Number of required confirmations.
    function changeRequirement(uint _required)
        public
        onlyWallet
        validRequirement(owners.length, _required)
    {
        required = _required;
        RequirementChange(_required);
    }

    /// @dev Allows an owner to submit and confirm a transaction.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @return Returns transaction ID.
    function submitTransaction(address destination, uint value, bytes data)
        // BK Ok
        public
        // BK Ok
        returns (uint transactionId)
    {
        // BK Ok - Does not check user is one of the owners
        transactionId = addTransaction(destination, value, data);
        // BK Ok - Confirm the tx, and if sufficient confirmations, send the tx
        confirmTransaction(transactionId);
    }

    /// @dev Allows an owner to confirm a transaction.
    /// @param transactionId Transaction ID.
    function confirmTransaction(uint transactionId)
        public
        // BK Ok - Owner must
        ownerExists(msg.sender)
        // BK Ok - Note that this wallet can never send funds to 0x0
        transactionExists(transactionId)
        // BK Ok - Check that the message sender has not already confirmed the txId
        notConfirmed(transactionId, msg.sender)
    {
        // BK Ok - Record that the message send has confirmed the txId
        confirmations[transactionId][msg.sender] = true;
        // BK Ok - Log event
        Confirmation(msg.sender, transactionId);
        // BK Ok - Execute the tx if there is enough confirmations
        executeTransaction(transactionId);
    }

    /// @dev Allows an owner to revoke a confirmation for a transaction.
    /// @param transactionId Transaction ID.
    function revokeConfirmation(uint transactionId)
        public
        ownerExists(msg.sender)
        confirmed(transactionId, msg.sender)
        notExecuted(transactionId)
    {
        confirmations[transactionId][msg.sender] = false;
        Revocation(msg.sender, transactionId);
    }

    /// @dev Allows anyone to execute a confirmed transaction.
    /// @param transactionId Transaction ID.
    function executeTransaction(uint transactionId)
        public
        notExecuted(transactionId)
    {
        if (isConfirmed(transactionId)) {
            Transaction tx = transactions[transactionId];
            tx.executed = true;
            if (tx.destination.call.value(tx.value)(tx.data))
                Execution(transactionId);
            else {
                ExecutionFailure(transactionId);
                tx.executed = false;
            }
        }
    }

    /// @dev Returns the confirmation status of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Confirmation status.
    function isConfirmed(uint transactionId)
        public
        constant
        returns (bool)
    {
        uint count = 0;
        for (uint i=0; i<owners.length; i++) {
            if (confirmations[transactionId][owners[i]])
                count += 1;
            if (count == required)
                return true;
        }
    }

    /*
     * Internal functions
     */
    /// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @return Returns transaction ID.
    // BK Ok
    function addTransaction(address destination, uint value, bytes data)
        // BK Ok - Cannot be called externally
        internal
        // BK Ok - Destination not null
        notNull(destination)
        // BK Ok
        returns (uint transactionId)
    {
        // BK Ok - First txId is 0
        transactionId = transactionCount;
        // BK Next 6 Ok - Store transaction data by txId
        transactions[transactionId] = Transaction({
            destination: destination,
            value: value,
            data: data,
            executed: false
        });
        // BK Ok - First txId, txCount = 1
        transactionCount += 1;
        // BK Ok - Log event
        Submission(transactionId);
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns number of confirmations of a transaction.
    /// @param transactionId Transaction ID.
    /// @return Number of confirmations.
    function getConfirmationCount(uint transactionId)
        public
        constant
        returns (uint count)
    {
        for (uint i=0; i<owners.length; i++)
            if (confirmations[transactionId][owners[i]])
                count += 1;
    }

    /// @dev Returns total number of transactions after filers are applied.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return Total number of transactions after filters are applied.
    // BK Ok - Constant function
    function getTransactionCount(bool pending, bool executed)
        public
        constant
        returns (uint count)
    {
        // BK Ok
        for (uint i=0; i<transactionCount; i++)
            // BK Ok
            if (   pending && !transactions[i].executed
                || executed && transactions[i].executed)
                // BK Ok
                count += 1;
    }

    /// @dev Returns list of owners.
    /// @return List of owner addresses.
    // BK Ok - Constant function
    function getOwners()
        public
        constant
        returns (address[])
    {
        // BK Ok
        return owners;
    }

    /// @dev Returns array with owner addresses, which confirmed transaction.
    /// @param transactionId Transaction ID.
    /// @return Returns array of owner addresses.
    function getConfirmations(uint transactionId)
        public
        constant
        returns (address[] _confirmations)
    {
        address[] memory confirmationsTemp = new address[](owners.length);
        uint count = 0;
        uint i;
        for (i=0; i<owners.length; i++)
            if (confirmations[transactionId][owners[i]]) {
                confirmationsTemp[count] = owners[i];
                count += 1;
            }
        _confirmations = new address[](count);
        for (i=0; i<count; i++)
            _confirmations[i] = confirmationsTemp[i];
    }

    /// @dev Returns list of transaction IDs in defined range.
    /// @param from Index start position of transaction array.
    /// @param to Index end position of transaction array.
    /// @param pending Include pending transactions.
    /// @param executed Include executed transactions.
    /// @return Returns array of transaction IDs.
    function getTransactionIds(uint from, uint to, bool pending, bool executed)
        public
        constant
        returns (uint[] _transactionIds)
    {
        uint[] memory transactionIdsTemp = new uint[](transactionCount);
        uint count = 0;
        uint i;
        for (i=0; i<transactionCount; i++)
            if (   pending && !transactions[i].executed
                || executed && transactions[i].executed)
            {
                transactionIdsTemp[count] = i;
                count += 1;
            }
        _transactionIds = new uint[](to - from);
        for (i=from; i<to; i++)
            _transactionIds[i - from] = transactionIdsTemp[i];
    }
}
```

<br />

<hr />

## Function Signatures

```
Constant Signature Function
-------- --------- ---------------------------------
         7065cb48 addOwner(address)
         ba51a6df changeRequirement(uint256)
         c01a8c84 confirmTransaction(uint256)
         ee22610b executeTransaction(uint256)
         173825d9 removeOwner(address)
         e20056e6 replaceOwner(address,address)
         20ea8d86 revokeConfirmation(uint256)
         c6427474 submitTransaction(address,uint256,bytes)
y        d74f8edd  MAX_OWNER_COUNT()
y        3411c81c confirmations(uint256,address)
y        8b51d13f getConfirmationCount(uint256)
y        b5dc40c3 getConfirmations(uint256)
y        a0e67e2b getOwners()
y        54741525 getTransactionCount(bool,bool)
y        a8abe69a getTransactionIds(uint256,uint256,bool,bool)
y        784547a7 isConfirmed(uint256)
y        2f54bf6e isOwner(address)
y        025e7c27 owners(uint256)
y        dc8452cd required()
y        b77bf600 transactionCount()
y        9ace38c2 transactions(uint256)
```

<br />

<br />

Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd and other respective authors July 29 2017. The MIT Licence.
