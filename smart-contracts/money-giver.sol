pragma solidity ^0.5.11;

// this contract is to test internal transactions

contract Ownable {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}

contract MoneyGiver is Ownable {
    function sendEthereum(address payable [] memory addresses, uint256 value) public onlyOwner {
        for (uint256 i = 0; i < addresses.length; i++) {
            addresses[i].transfer(value);
        }
    }

    function () external payable {}
}
