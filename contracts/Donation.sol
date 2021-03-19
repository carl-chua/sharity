pragma solidity ^0.5.0;
import "./Charity.sol";

contract Donation {
    
    Charity charityContract;
    address contractOwner = msg.sender;
    
    struct Transaction {
        uint transactionId;
	    address donor;
	    uint campaignId;
	    uint amount;
    }
    
    uint numTransactions = 1;
    mapping (address => Transaction[]) donorDonations;
    mapping (uint => Transaction[]) campaignDonations;
    
    event donated(uint newTransactionId);
    
    constructor(Charity charityAddress) public {
        charityContract = charityAddress;
    }
    
    /*
    * This function is for donors to donate to a campaign that is still ongoing. The function assumes that
    * the uint amount == msg.value (in ether)
    */
    function donate(uint campaignId, uint amount) public payable returns (uint256) {
        require(msg.value > 0 ether, "Donation value needs to be more than 0 ether");
        require(charityContract.isStatusComplete(campaignId) == false, "Campaign has already ended");
        require(amount <= (getRemainingAmount(campaignId)), "Donation value is more than campaign's remaining amount");
        
        Transaction memory newTransaction = Transaction(
            numTransactions,
            msg.sender,
            campaignId,
            amount
        );
        
        charityContract.updateCampaignCurrentDonation(campaignId, amount);
        if(checkPreviouslyDonated(msg.sender, campaignId) == false) {
            charityContract.addCampaignDonor(campaignId);
        }
        
        donorDonations[msg.sender].push(newTransaction);
        campaignDonations[campaignId].push(newTransaction);
        
        uint newTransactionId = numTransactions++;
        emit donated(newTransactionId);
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
    
    // to view remaining amount for campaign
    function getRemainingAmount(uint campaignId) public view returns(uint){
        require(charityContract.checkValidCampaign(campaignId) == true);
        uint target = charityContract.getCampaignTargetDonation(campaignId);
        uint current = charityContract.getCampaignCurrentDonation(campaignId);
        return (target - current);
    }
    
    /**
     * getCampaignDonation only retrieves a specific donation within a campaign. To retrieve the full donation
     * history of the campagin, it would require looping of entire Transaction[] mapped to campaignId
    */
    function getCampaignDonation(uint campaignId, uint index) public view returns(uint, address, uint, uint){
        require(charityContract.checkValidCampaign(campaignId) == true);
        return (campaignDonations[campaignId][index].transactionId, campaignDonations[campaignId][index].donor,
        campaignDonations[campaignId][index].campaignId, campaignDonations[campaignId][index].amount);
    }
    
    // use this function for looping on front-end
    function getCampaignTotalDonations(uint campaignId) public view returns(uint){
        require(charityContract.checkValidCampaign(campaignId) == true);
        return (campaignDonations[campaignId].length);
    }
    
    // function to check if donor has donated to campaign before
    function checkPreviouslyDonated(address donor, uint campaignId) public view returns(bool){
        require(charityContract.checkValidCampaign(campaignId) == true);
        uint length = campaignDonations[campaignId].length;
        for (uint i = 0; i < length; i++) {
            if(campaignDonations[campaignId][i].donor == donor) {
                return true;
            }
        }
        return false;
    }
    
}