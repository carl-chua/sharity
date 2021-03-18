pragma solidity ^0.5.0;
// import "./Charity.sol";

contract Donation {
    
    // Charity charityContract;
    address contractOwner = msg.sender;
    
    struct Transaction {
        uint transactionId;
	    address donor;
	    uint campaignId;
	    uint amount;
    }
    
    uint numTransactions = 1;
    mapping (address => Transaction[]) public donorDonations;
    mapping (uint => Transaction[]) campaignDonations;
    
    function donate(uint campaignId) public payable returns (uint256) {
        require(msg.value > 0 ether, "donation value needs to be more than 0 ether");
        //integrate the checks for valid campaignId
        
        Transaction memory newTransaction = Transaction(
            numTransactions,
            msg.sender,
            campaignId,
            msg.value
        );
        donorDonations[msg.sender].push(newTransaction);
        campaignDonations[campaignId].push(newTransaction);
        
        uint newTransactionId = numTransactions++;
        return newTransactionId;
    }
    
    /**
     * getDonorDonation only retrieves a specific donation by a donor. To retrieve the full donation
     * history by donor, it would require looping of entire Transaction[] mapped to donor address
    */
    function getDonorDonation(address donor, uint index) public view returns(uint, address, uint, uint){
        return (donorDonations[donor][index].transactionId, donorDonations[donor][index].donor,
        donorDonations[donor][index].campaignId, donorDonations[donor][index].amount);
    }
    
    // use this function for looping on front-end
    function getDonorTotalDonations(address donor) public view returns(uint){
        return (donorDonations[donor].length);
    }
    
    // change back to 'public view returns(uint)' later
    function getRemainingAmount(uint campaignId) public pure returns(uint){
        //to change return value later
        return (campaignId+1);
    }
    
    /**
     * getCampaignDonation only retrieves a specific donation within a campaign. To retrieve the full donation
     * history of the campagin, it would require looping of entire Transaction[] mapped to campaignId
    */
    function getCampaignDonation(uint campaignId, uint index) public view returns(uint, address, uint, uint){
        return (campaignDonations[campaignId][index].transactionId, campaignDonations[campaignId][index].donor,
        campaignDonations[campaignId][index].campaignId, campaignDonations[campaignId][index].amount);
    }
    
    // use this function for looping on front-end
    function getCampaignTotalDonations(uint campaignId) public view returns(uint){
        return (campaignDonations[campaignId].length);
    }
    
}