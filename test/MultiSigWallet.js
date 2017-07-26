var walletOutput={"contracts":{"MultiSigWallet.sol:MultiSigWallet":{"abi":"[{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"owners\",\"outputs\":[{\"name\":\"\",\"type\":\"address\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"removeOwner\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"transactionId\",\"type\":\"uint256\"}],\"name\":\"revokeConfirmation\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"address\"}],\"name\":\"isOwner\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"},{\"name\":\"\",\"type\":\"address\"}],\"name\":\"confirmations\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"pending\",\"type\":\"bool\"},{\"name\":\"executed\",\"type\":\"bool\"}],\"name\":\"getTransactionCount\",\"outputs\":[{\"name\":\"count\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getOwnersLength\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"addOwner\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"transactionId\",\"type\":\"uint256\"}],\"name\":\"isConfirmed\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"transactionId\",\"type\":\"uint256\"}],\"name\":\"getConfirmationCount\",\"outputs\":[{\"name\":\"count\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"name\":\"transactions\",\"outputs\":[{\"name\":\"destination\",\"type\":\"address\"},{\"name\":\"value\",\"type\":\"uint256\"},{\"name\":\"data\",\"type\":\"bytes\"},{\"name\":\"executed\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"getOwners\",\"outputs\":[{\"name\":\"\",\"type\":\"address[]\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"from\",\"type\":\"uint256\"},{\"name\":\"to\",\"type\":\"uint256\"},{\"name\":\"pending\",\"type\":\"bool\"},{\"name\":\"executed\",\"type\":\"bool\"}],\"name\":\"getTransactionIds\",\"outputs\":[{\"name\":\"_transactionIds\",\"type\":\"uint256[]\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"transactionId\",\"type\":\"uint256\"}],\"name\":\"getConfirmations\",\"outputs\":[{\"name\":\"_confirmations\",\"type\":\"address[]\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"transactionCount\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_required\",\"type\":\"uint256\"}],\"name\":\"changeRequirement\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"transactionId\",\"type\":\"uint256\"}],\"name\":\"confirmTransaction\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"destination\",\"type\":\"address\"},{\"name\":\"value\",\"type\":\"uint256\"},{\"name\":\"data\",\"type\":\"bytes\"}],\"name\":\"submitTransaction\",\"outputs\":[{\"name\":\"transactionId\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"MAX_OWNER_COUNT\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[],\"name\":\"required\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"owner\",\"type\":\"address\"},{\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"replaceOwner\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"transactionId\",\"type\":\"uint256\"}],\"name\":\"executeTransaction\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"inputs\":[{\"name\":\"_owners\",\"type\":\"address[]\"},{\"name\":\"_required\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"constructor\"},{\"payable\":true,\"type\":\"fallback\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":true,\"name\":\"transactionId\",\"type\":\"uint256\"}],\"name\":\"Confirmation\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":true,\"name\":\"transactionId\",\"type\":\"uint256\"}],\"name\":\"Revocation\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"transactionId\",\"type\":\"uint256\"}],\"name\":\"Submission\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"transactionId\",\"type\":\"uint256\"}],\"name\":\"Execution\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"transactionId\",\"type\":\"uint256\"}],\"name\":\"ExecutionFailure\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"sender\",\"type\":\"address\"},{\"indexed\":false,\"name\":\"value\",\"type\":\"uint256\"}],\"name\":\"Deposit\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"OwnerAddition\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"OwnerRemoval\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"name\":\"required\",\"type\":\"uint256\"}],\"name\":\"RequirementChange\",\"type\":\"event\"}]","bin":"606060405234156200000d57fe5b604051620018633803806200186383398101604052805160208201519101905b600082518260328211806200004157508181115b806200004b575080155b8062000055575081155b15620000615760006000fd5b600092505b845183101562000136576002600086858151811015156200008357fe5b6020908102909101810151600160a060020a031682528101919091526040016000205460ff1680620000d657508483815181101515620000bf57fe5b90602001906020020151600160a060020a03166000145b15620000e25760006000fd5b6001600260008786815181101515620000f757fe5b602090810291909101810151600160a060020a03168252810191909152604001600020805460ff19169115159190911790555b60019092019162000066565b84516200014b9060039060208801906200015e565b5060048490555b5b5050505050620001f7565b828054828255906000526020600020908101928215620001b6579160200282015b82811115620001b65782518254600160a060020a031916600160a060020a039091161782556020909201916001909101906200017f565b5b50620001c5929150620001c9565b5090565b620001f491905b80821115620001c5578054600160a060020a0319168155600101620001d0565b5090565b90565b61165c80620002076000396000f300606060405236156101255763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041663025e7c278114610177578063173825d9146101a657806320ea8d86146101c45780632f54bf6e146101d95780633411c81c14610209578063547415251461023c57806357b543e2146102685780637065cb481461028a578063784547a7146102a85780638b51d13f146102cf5780639ace38c2146102f4578063a0e67e2b146103b1578063a8abe69a1461041c578063b5dc40c314610497578063b77bf60014610505578063ba51a6df14610527578063c01a8c841461053c578063c642747414610551578063d74f8edd146105c6578063dc8452cd146105e8578063e20056e61461060a578063ee22610b1461062e575b6101755b600034111561017257604080513481529051600160a060020a033316917fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c919081900360200190a25b5b565b005b341561017f57fe5b61018a600435610643565b60408051600160a060020a039092168252519081900360200190f35b34156101ae57fe5b610175600160a060020a0360043516610675565b005b34156101cc57fe5b610175600435610826565b005b34156101e157fe5b6101f5600160a060020a0360043516610903565b604080519115158252519081900360200190f35b341561021157fe5b6101f5600435600160a060020a0360243516610918565b604080519115158252519081900360200190f35b341561024457fe5b61025660043515156024351515610938565b60408051918252519081900360200190f35b341561027057fe5b6102566109a7565b60408051918252519081900360200190f35b341561029257fe5b610175600160a060020a03600435166109ae565b005b34156102b057fe5b6101f5600435610ae5565b604080519115158252519081900360200190f35b34156102d757fe5b610256600435610b79565b60408051918252519081900360200190f35b34156102fc57fe5b610307600435610bf8565b60408051600160a060020a03861681526020810185905282151560608201526080918101828152845460026000196101006001841615020190911604928201839052909160a08301908590801561039f5780601f106103745761010080835404028352916020019161039f565b820191906000526020600020905b81548152906001019060200180831161038257829003601f168201915b50509550505050505060405180910390f35b34156103b957fe5b6103c1610c2c565b6040805160208082528351818301528351919283929083019185810191028083838215610409575b80518252602083111561040957601f1990920191602091820191016103e9565b5050509050019250505060405180910390f35b341561042457fe5b6103c160043560243560443515156064351515610c95565b6040805160208082528351818301528351919283929083019185810191028083838215610409575b80518252602083111561040957601f1990920191602091820191016103e9565b5050509050019250505060405180910390f35b341561049f57fe5b6103c1600435610dca565b6040805160208082528351818301528351919283929083019185810191028083838215610409575b80518252602083111561040957601f1990920191602091820191016103e9565b5050509050019250505060405180910390f35b341561050d57fe5b610256610f52565b60408051918252519081900360200190f35b341561052f57fe5b610175600435610f58565b005b341561054457fe5b610175600435610fe8565b005b341561055957fe5b604080516020600460443581810135601f8101849004840285018401909552848452610256948235600160a060020a03169460248035956064949293919092019181908401838280828437509496506110d695505050505050565b60408051918252519081900360200190f35b34156105ce57fe5b6102566110f6565b60408051918252519081900360200190f35b34156105f057fe5b6102566110fb565b60408051918252519081900360200190f35b341561061257fe5b610175600160a060020a0360043581169060243516611101565b005b341561063657fe5b6101756004356112bd565b005b600380548290811061065157fe5b906000526020600020900160005b915054906101000a9004600160a060020a031681565b600030600160a060020a031633600160a060020a03161415156106985760006000fd5b600160a060020a038216600090815260026020526040902054829060ff1615156106c25760006000fd5b600160a060020a0383166000908152600260205260408120805460ff1916905591505b600354600019018210156107bd5782600160a060020a031660038381548110151561070c57fe5b906000526020600020900160005b9054906101000a9004600160a060020a0316600160a060020a031614156107b15760038054600019810190811061074d57fe5b906000526020600020900160005b9054906101000a9004600160a060020a031660038381548110151561077c57fe5b906000526020600020900160005b6101000a815481600160a060020a030219169083600160a060020a031602179055506107bd565b5b6001909101906106e5565b6003805460001901906107d09082611518565b5060035460045411156107e9576003546107e990610f58565b5b604051600160a060020a038416907f8001553a916ef2f495d26a907cc54d96ed840d7bda71e73194bf5a9df7a76b9090600090a25b5b505b5050565b33600160a060020a03811660009081526002602052604090205460ff16151561084f5760006000fd5b600082815260016020908152604080832033600160a060020a038116855292529091205483919060ff1615156108855760006000fd5b600084815260208190526040902060030154849060ff16156108a75760006000fd5b6000858152600160209081526040808320600160a060020a0333168085529252808320805460ff191690555187927ff6a317157440607f36269043eb55f1287a5a19ba2216afeab88cd46cbcfb88e991a35b5b505b50505b5050565b60026020526000908152604090205460ff1681565b600160209081526000928352604080842090915290825290205460ff1681565b6000805b60055481101561099f57838015610965575060008181526020819052604090206003015460ff16155b806109895750828015610989575060008181526020819052604090206003015460ff165b5b15610996576001820191505b5b60010161093c565b5b5092915050565b6003545b90565b30600160a060020a031633600160a060020a03161415156109cf5760006000fd5b600160a060020a038116600090815260026020526040902054819060ff16156109f85760006000fd5b81600160a060020a0381161515610a0f5760006000fd5b6003805490506001016004546032821180610a2957508181115b80610a32575080155b80610a3b575081155b15610a465760006000fd5b600160a060020a0385166000908152600260205260409020805460ff191660019081179091556003805490918101610a7e8382611518565b916000526020600020900160005b8154600160a060020a03808a166101009390930a838102910219909116179091556040519091507ff39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d90600090a25b5b50505b505b505b50565b600080805b600354811015610b715760008481526001602052604081206003805491929184908110610b1357fe5b906000526020600020900160005b9054600160a060020a036101009290920a900416815260208101919091526040016000205460ff1615610b55576001820191505b600454821415610b685760019250610b71565b5b600101610aea565b5b5050919050565b6000805b600354811015610bf15760008381526001602052604081206003805491929184908110610ba657fe5b906000526020600020900160005b9054600160a060020a036101009290920a900416815260208101919091526040016000205460ff1615610be8576001820191505b5b600101610b7d565b5b50919050565b6000602081905290815260409020805460018201546003830154600160a060020a0390921692909160029091019060ff1684565b610c3461156c565b6003805480602002602001604051908101604052809291908181526020018280548015610c8a57602002820191906000526020600020905b8154600160a060020a03168152600190910190602001808311610c6c575b505050505090505b90565b610c9d61156c565b610ca561156c565b60006000600554604051805910610cb95750595b908082528060200260200182016040525b50925060009150600090505b600554811015610d5357858015610cff575060008181526020819052604090206003015460ff16155b80610d235750848015610d23575060008181526020819052604090206003015460ff165b5b15610d4a57808383815181101515610d3857fe5b60209081029091010152600191909101905b5b600101610cd6565b878703604051805910610d635750595b908082528060200260200182016040525b5093508790505b86811015610dbe578281815181101515610d9157fe5b9060200190602002015184898303815181101515610dab57fe5b602090810290910101525b600101610d7b565b5b505050949350505050565b610dd261156c565b610dda61156c565b6003546040516000918291805910610def5750595b908082528060200260200182016040525b50925060009150600090505b600354811015610ed45760008581526001602052604081206003805491929184908110610e3557fe5b906000526020600020900160005b9054600160a060020a036101009290920a900416815260208101919091526040016000205460ff1615610ecb576003805482908110610e7e57fe5b906000526020600020900160005b9054906101000a9004600160a060020a03168383815181101515610eac57fe5b600160a060020a03909216602092830290910190910152600191909101905b5b600101610e0c565b81604051805910610ee25750595b908082528060200260200182016040525b509350600090505b81811015610f49578281815181101515610f1157fe5b906020019060200201518482815181101515610f2957fe5b600160a060020a039092166020928302909101909101525b600101610efb565b5b505050919050565b60055481565b30600160a060020a031633600160a060020a0316141515610f795760006000fd5b600354816032821180610f8b57508181115b80610f94575080155b80610f9d575081155b15610fa85760006000fd5b60048390556040805184815290517fa3f1ee9126a074d9326c682f561767f710e927faa811f7a99829d49dc421797a9181900360200190a15b5b50505b50565b33600160a060020a03811660009081526002602052604090205460ff1615156110115760006000fd5b6000828152602081905260409020548290600160a060020a031615156110375760006000fd5b600083815260016020908152604080832033600160a060020a038116855292529091205484919060ff161561106c5760006000fd5b6000858152600160208181526040808420600160a060020a0333168086529252808420805460ff1916909317909255905187927f4a504a94899432a9846e1aa406dceb1bcfd538bb839071d49d1e5e23f5be30ef91a36108f9856112bd565b5b5b50505b505b5050565b60006110e3848484611425565b90506110ee81610fe8565b5b9392505050565b603281565b60045481565b600030600160a060020a031633600160a060020a03161415156111245760006000fd5b600160a060020a038316600090815260026020526040902054839060ff16151561114e5760006000fd5b600160a060020a038316600090815260026020526040902054839060ff16156111775760006000fd5b600092505b60035483101561121f5784600160a060020a031660038481548110151561119f57fe5b906000526020600020900160005b9054906101000a9004600160a060020a0316600160a060020a0316141561121357836003848154811015156111de57fe5b906000526020600020900160005b6101000a815481600160a060020a030219169083600160a060020a0316021790555061121f565b5b60019092019161117c565b600160a060020a03808616600081815260026020526040808220805460ff1990811690915593881682528082208054909416600117909355915190917f8001553a916ef2f495d26a907cc54d96ed840d7bda71e73194bf5a9df7a76b9091a2604051600160a060020a038516907ff39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d90600090a25b5b505b505b505050565b600081815260208190526040812060030154829060ff16156112df5760006000fd5b6112e883610ae5565b1561081f576000838152602081905260409081902060038101805460ff19166001908117909155815481830154935160028085018054959850600160a060020a03909316959492939192839285926000199183161561010002919091019091160480156113965780601f1061136b57610100808354040283529160200191611396565b820191906000526020600020905b81548152906001019060200180831161137957829003601f168201915b505091505060006040518083038185876187965a03f192505050156113e55760405183907f33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed7590600090a261081f565b60405183907f526441bb6c1aba3c9a4a6ca1d6545da9c2333c8c48343ef398eb858d72b7923690600090a260038201805460ff191690555b5b5b5b505050565b600083600160a060020a038116151561143e5760006000fd5b60055460408051608081018252600160a060020a0388811682526020808301898152838501898152600060608601819052878152808452959095208451815473ffffffffffffffffffffffffffffffffffffffff1916941693909317835551600183015592518051949650919390926114be926002850192910190611590565b50606091909101516003909101805460ff191691151591909117905560058054600101905560405182907fc0ba8fe4b176c1714197d43b9cc6bcf797a4a7461c5fe8d0ef6e184ae7601e5190600090a25b5b509392505050565b81548183558181151161081f5760008381526020902061081f91810190830161160f565b5b505050565b81548183558181151161081f5760008381526020902061081f91810190830161160f565b5b505050565b60408051602081019091526000815290565b60408051602081019091526000815290565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106115d157805160ff19168380011785556115fe565b828001600101855582156115fe579182015b828111156115fe5782518255916020019190600101906115e3565b5b5061160b92915061160f565b5090565b6109ab91905b8082111561160b5760008155600101611615565b5090565b905600a165627a7a7230582057c992d5f510d25c2748590cb16b9112046b1c8c9a7108ae02965b2fac6f2d440029"}},"version":"0.4.11+commit.68ef5810.Darwin.appleclang"};