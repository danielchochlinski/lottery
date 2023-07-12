// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

contract Lottery {
    //state
    address public owner;
    address payable[] public players;
    address[] public winners;
    uint public lotteryId;

    constructor() {
        owner = msg.sender;
        lotteryId = 0;
    }

    //Enter function
    function enter() public payable {
        require(
            msg.value >= 0.001 ether,
            "At least 0.001 eth to enter lottery"
        );
        players.push(payable(msg.sender));
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getLotteryId() public view returns (uint) {
        return lotteryId;
    }

    function getRandomNumber() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function pickWinner() public {
        require(msg.sender == owner);
        uint randomIndex = getRandomNumber() % players.length;
        players[randomIndex].transfer(address(this).balance);
        winners.push(players[randomIndex]);
        lotteryId++;

        delete players;
    }

    function getWinners() public view returns (address[] memory) {
        return winners;
    }
}
