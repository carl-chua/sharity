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
        uint date;
        string hash;
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
    * the uint amount == msg.value
    */
    function donate(uint campaignId, uint amount, uint date) public payable returns (uint256) {
        require(msg.value > 0, "Donation value needs to be more than 0 wei");
        require(charityContract.isStatusComplete(campaignId) == false, "Campaign has already ended");
        require(amount <= (getRemainingAmount(campaignId)), "Donation value is more than campaign's remaining amount");
        
        Transaction memory newTransaction = Transaction(
            numTransactions,
            msg.sender,
            campaignId,
            amount,
            date,
            ""
        );
        
        charityContract.updateCampaignCurrentDonation(campaignId, amount);
        if(checkPreviouslyDonated(msg.sender, campaignId) == false) {
            charityContract.addCampaignDonor(campaignId);
        }
        
        donorDonations[msg.sender].push(newTransaction);
        campaignDonations[campaignId].push(newTransaction);

        uint id = charityContract.getCampaignCharity(campaignId);
        address payable recipient = address(uint160(charityContract.getCharityOwner(id)));
        recipient.transfer(msg.value);

        if(charityContract.checkCharityDonor(msg.sender, id) == false) {
            charityContract.addCharityDonor(msg.sender, id);
        }
        
        uint newTransactionId = numTransactions++;
        emit donated(newTransactionId);
        return newTransactionId;
    }
    
    /**
     * getDonorDonation only retrieves a specific donation by a donor. To retrieve the full donation
     * history by donor, it would require looping of entire Transaction[] mapped to donor address
    */
    function getDonorDonation(address donor, uint index) public view returns(uint, address, uint, uint, uint, string memory){
        return (donorDonations[donor][index].transactionId, donorDonations[donor][index].donor,
        donorDonations[donor][index].campaignId, donorDonations[donor][index].amount, 
        donorDonations[donor][index].date, donorDonations[donor][index].hash);
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

    // function to set the transaction hash
    function setTransactionHash(uint id, uint campaignId, address donor, string memory hash) public {
        uint cLength = campaignDonations[campaignId].length;
        for (uint i = 0; i < cLength; i++) {
            if(campaignDonations[campaignId][i].transactionId == id) {
                campaignDonations[campaignId][i].hash = hash;
            }
        }

        uint dLength = donorDonations[donor].length;
        for (uint i = 0; i < dLength; i++) {
            if(donorDonations[donor][i].transactionId == id) {
                donorDonations[donor][i].hash = hash;
            }
        }
    }

}