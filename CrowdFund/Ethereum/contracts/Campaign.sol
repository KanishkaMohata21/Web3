// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//variables are storage and arguments or parameters are memory
contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimumContribution) public {
        address newCampaign = address(new Campaign(minimumContribution,msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

//if a contract is called from a contract that the contract is manager not the user

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalcount;
        mapping (address=>bool) approvals;
    }
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address=>bool) public approvers;
    uint public approverCount;

    modifier restricted() {
        require(msg.sender == manager, "This function is restricted to the manager");
        _;
    }

    constructor(uint _minimumContribution, address _manager) {
        minimumContribution = _minimumContribution;
        manager = _manager;
    }
    function contribute() public payable {
        require(msg.value>minimumContribution);
        approvers[msg.sender] = true;
        approverCount++;
    }

    function createRequest(string memory description, uint256 value, address recipient) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalcount = 0;
    }
    
    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalcount++;
    }
    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(!request.complete, "Request is already complete");
        require(request.approvalcount > (approverCount / 2), "Not enough approvals");
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
    function getSummary() public view returns (
      uint, uint, uint, uint, address
      ) {
        return (
          minimumContribution,
          address(this).balance,
          requests.length,
          approverCount,
          manager
        );
    }
    
    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

}

//looping through a big array coasts a lot of gas so avoid it
//searching through an mapping is constant time search 

//in mapping keys are not stored 
//we can access value by passing a key in lookup process then a hashing function is 
//called on that key and then a index is generated to get the value

//in mapping values are not iterable
//in mapping all values exists
