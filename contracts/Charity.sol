pragma solidity ^0.5.0;

contract Charity {
    enum CharityStatus {UNVERIFIED, VERIFIED, REJECTED}

    enum CampaignStatus {ONGOING, ENDED}

    struct charity {
        address charityOwner;
        string charityName;
        string charityAddress;
        string contactNumber;
        string description;
        string pictureURL;
        string verificationLink;
        CharityStatus charityStatus;
        address[] donors;
    }

    struct campaign {
        uint256 charityId;
        string campaignName;
        string description;
        string pictureURL;
        uint256 targetDonation;
        uint256 currentDonation;
        uint256 noOfDonors;
        uint256 startDate;
        uint256 endDate;
        CampaignStatus campaignStatus;
    }
    
    address contractOwner = msg.sender;
    mapping(uint256 => bool) isVerifiedCharity;
    mapping(uint256 => charity) charities;
    mapping(address => uint256) charityAddressIdMap;
    mapping(address => charity) charityAddressMap;
    mapping(address => bool) charityOwnerRegistered;
    address[] donors;
    uint256 noOfCharities = 0;
    uint contractMoney = 0;
    uint256 charityRegFee = 5 * 10**17; // Reg fee is 0.5 ether, 1 ether is 10**18 wei

    mapping(uint256 => bool) isOngoingCampaign;
    mapping(uint256 => campaign) campaigns;
    uint256 noOfCampaigns = 0;
    uint256 noOfReturns = 0;

    modifier onlyOwner(address caller) {
        require(caller == contractOwner, "Caller is not contract owner");
        _;
    }

    // This will be the modifier that checks whether the function call is done by the Charity itself.
    modifier onlyVerifiedCharity(address caller) {
        require(
            isVerifiedCharity[charityAddressIdMap[caller]],
            "Caller is not a valid charity"
        );
        _;
    }

    // This will be the modifier that checks whether the function call is done by the Charity or contract owner itself.
    modifier onlyVerifiedCharityOrOwner(address caller) {
        require(
            isVerifiedCharity[charityAddressIdMap[caller]] || caller == contractOwner,
            "Caller is not a valid charity nor contract owner"
        );
        _;
    }

    /*
     * This will be the function that check the address type
     * Parameters of this function will include address inputAddress
     * This function assumes all input address are either contract, charity, or donor
     */
    function checkAddressType(
        address inputAddress
    )
        public
        view
        returns (string memory)
    {
        if (inputAddress == contractOwner) {
            return "CONTRACT";
        } else if (charityOwnerRegistered[inputAddress] == true) {
            return "CHARITYOWNER";
        } else {
            return "DONOR";
        }
    }

    /*
     * This will be the function that allows contract owner to withdraw money
     * There will be no parameters for this function
     */
    function withdrawMoney() 
        public
        onlyOwner(msg.sender)
    {
        require(contractMoney >= 3 * charityRegFee, "Current money is less than 3 * charity register fee");
        address payable recipient = address(uint160(address(this)));
        recipient.transfer(contractMoney);
        contractMoney = 0;
    }

    /* 
     * This fallback function is to make contract address able to receive/make payments
     */
    function() external payable { }

    /*
     * This will be the payable function to register the charity
     * Parameters will be string charityName, string charityAddress, string contactNumber, string description and string pictureURL
     * Need at least 0.5 ether to register
    */

    function registerCharity(
        string memory charityName,
        string memory charityAddress,
        string memory contactNumber,
        string memory description,
        string memory pictureURL
    )   
        public payable 
        returns (uint256 charityId) {

        require(
            charityOwnerRegistered[msg.sender] == false,
            "This address has registered another charity already"
        );
        require(
            msg.value >= charityRegFee,
            "Need at least 0.5 ether to register a charity"
        );
        contractMoney = contractMoney + msg.value;
        charityId = noOfCharities++;
        charity memory newCharity =
            charity(
                msg.sender,
                charityName,
                charityAddress,
                contactNumber,
                description,
                pictureURL,
                "",
                CharityStatus.UNVERIFIED,
                donors
            );
        charities[charityId] = newCharity;
        charityAddressIdMap[msg.sender] = charityId;
        isVerifiedCharity[charityId] = false;
        charityOwnerRegistered[msg.sender] = true;
        
        address payable recipient = address(uint160(contractOwner));
        recipient.transfer(msg.value);
        
        return charityId;
    }

    /*
     * This will be the function for contract owner to verify the charity
     * Parameters will be uint charityId, string verification
    */
    function verifyCharity(
        uint256 charityId, string memory verificationLink
    )
        public
        onlyOwner(msg.sender)
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        require(charityId < noOfCharities, "Invalid charity id");
        require(
            charities[charityId].charityStatus == CharityStatus.UNVERIFIED,
            "Charity has been verified or rejected"
        );
        require(
            isVerifiedCharity[charityId] == false,
            "Charity has been verified"
        );

        charities[charityId].charityStatus = CharityStatus.VERIFIED;
        charities[charityId].verificationLink = verificationLink;
        isVerifiedCharity[charityId] = true;
    }

    /*
     * This will be the function for contract owner to reject the charity
     * Parameters will be uint charityId, string verification
    */
    function rejectCharity(
        uint256 charityId
    ) 
        public 
        onlyOwner(msg.sender) 
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        require(charityId < noOfCharities, "Invalid charity id");
        require(
            charities[charityId].charityStatus == CharityStatus.UNVERIFIED,
            "Charity has been verified or rejected"
        );
        require(
            isVerifiedCharity[charityId] == false,
            "Charity has been verified"
        );

        charities[charityId].charityStatus = CharityStatus.REJECTED;
    }

    /*
     * This will be the function for contract owner to revoke the charity
     * Parameters will be uint charityId, string verification
    */
    function revokeCharity(
        uint256 charityId
    ) 
        public 
        onlyOwner(msg.sender) 
    {
        require(charityId < noOfCharities, "Invalid charity id");
        require(
            charities[charityId].charityStatus == CharityStatus.VERIFIED,
            "Charity is not a verified charity"
        );

        charities[charityId].charityStatus = CharityStatus.REJECTED;
    }

    /*
     * This will be the function that charities call to create a campaign.
     * Parameters of this function will include string campaignName, string description, string pictureURL, uint targetDonation (of the campaign), uint startDate (of the campaign), uint endDate (of the campaign)
     */
    function createCampaign(
        string memory campaignName,
        string memory description,
        string memory pictureURL,
        uint256 targetDonation,
        uint256 startDate,
        uint256 endDate
    ) 
        public 
        onlyVerifiedCharity(msg.sender) 
        returns (uint256 campaignId) 
    {
        campaignId = noOfCampaigns++;
        uint256 charityId = charityAddressIdMap[msg.sender];
        campaign memory newCampaign =
            campaign(
                charityId,
                campaignName,
                description,
                pictureURL,
                targetDonation,
                0,
                0,
                startDate,
                endDate,
                CampaignStatus.ONGOING
            );
        campaigns[campaignId] = newCampaign;
        isOngoingCampaign[campaignId] = true;
        return campaignId;
    }

    /*
     * This will be the function that charities or contract owner call to end an ongoing campaign.
     * Parameters of this function will include uint campaignId
     */
    function endCampaign(
        uint256 campaignId
    )
        public
        onlyVerifiedCharityOrOwner(msg.sender)
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        require(isOngoingCampaign[campaignId], "Campaign is not ongoing");
        require(
            msg.sender ==
                charities[campaigns[campaignId].charityId].charityOwner ||
                msg.sender == contractOwner,
            "Caller is not authorized for this operation"
        );

        campaigns[campaignId].campaignStatus = CampaignStatus.ENDED;
        isOngoingCampaign[campaignId] = false;
    }

    /*
     * This will be the getter function that everyone can call to check the charity address.
     * Parameters of this function will include uint charityId
     */
    function getCharityOwner(
        uint256 charityId
    ) 
        public 
        view 
        returns (address) 
    {
        require(charityId < noOfCharities, "Invalid charity id");
        return charities[charityId].charityOwner;
    }

    /*
     * This will be the getter function that everyone can call to check the charity id.
     * Parameters of this function will include address inputAddress
     */
    function getCharityIdByAddress(
        address inputAddress
    )  
        public
        view
        returns (uint256)
    {
        require(
            charityOwnerRegistered[inputAddress] == true,
            "Address not owner of any charity"
        );
        uint256 charityIdByAddress = charityAddressIdMap[inputAddress];
        return charityIdByAddress;
    }

    /*
     * This will be the getter function that everyone can call to check the charity name.
     * Parameters of this function will include uint charityId
     */
    function getCharityName(
        uint256 charityId
    )
        public
        view
        returns (string memory)
    {
        require(charityId < noOfCharities, "Invalid charity id");
        return charities[charityId].charityName;
    }

    /*
     * This will be the getter function that everyone can call to check the charity pictureURL.
     * Parameters of this function will include uint charityId
     */
    function getCharityPictureURL(
        uint256 charityId
    )
        public
        view
        returns (string memory)
    {
        require(charityId < noOfCharities, "Invalid charity id");
        return charities[charityId].pictureURL;
    }

    /*
     * This will be the getter function that everyone can call to check the charity pictureURL.
     * Parameters of this function will include address inputAddress
     */
    function getCharityPictureURLByAddress(address inputAddress)   
        public
        view
        returns (string memory)
    {
        require(
            charityOwnerRegistered[inputAddress] == true,
            "Address not owner of any charity"
        );
        uint256 charityIdByAddress = charityAddressIdMap[inputAddress];
        return charities[charityIdByAddress].pictureURL;
    }

    /*
     * This will be the getter function that everyone can call to check the charity description.
     * Parameters of this function will include uint charityId
     */
    function getCharityDescription(
        uint256 charityId
    )
        public
        view
        returns (string memory)
    {
        require(charityId < noOfCharities, "Invalid charity id");
        return charities[charityId].description;
    }

    /*
     * This will be the getter function that everyone can call to check the charity status.
     * Parameters of this function will include uint charityId
     */
    function getCharityStatus(
        uint256 charityId
    )
        public
        view
        returns (CharityStatus)
    {
        require(charityId < noOfCharities, "Invalid charity id");
        return charities[charityId].charityStatus;
    }

    /*
     * This will be the getter function that everyone can call to check the charity status.
     * Parameters of this function will include address inputAddress
     */
    function getCharityStatusByAddress(
        address inputAddress
    )   
        public
        view
        returns (CharityStatus)
    {
        require(
            charityOwnerRegistered[inputAddress] == true,
            "Address not owner of any charity"
        );
        uint256 charityIdByAddress = charityAddressIdMap[inputAddress];
        return charities[charityIdByAddress].charityStatus;
    }

    /*
     * This will be the getter function that everyone can call to get the charity contact number.
     * Parameters of this function will include uint charityId
     */
    function getCharityContactNumber(
        uint256 charityId
    )
        public
        view
        returns (string memory)
    {
        require(charityId < noOfCharities, "Invalid charity id");
        return charities[charityId].contactNumber;
    }

    /*
     * This will be the getter function that everyone can call to get the charity contact address.
     * Parameters of this function will include uint charityId
     */
    function getCharityContactAddress(
        uint256 charityId
    )
        public
        view
        returns (string memory)
    {
        require(charityId < noOfCharities, "Invalid charity id");
        return charities[charityId].charityAddress;
    }

    /*
     * This will be the getter function that everyone can call to get the charity verification Link.
     * Parameters of this function will include uint charityId
     */
    function getCharityVerificationLink(
        uint256 charityId
    )
        public
        view
        returns (string memory)
    {
        require(charityId < noOfCharities, "Invalid charity id");
        return charities[charityId].verificationLink;
    }


    /*
     * This will be the getter function that everyone can call to get the total amounts of the charities.
     * There will be no parameters for this function
     */
    function getNoOfCharities() 
        public 
        view 
        returns (uint256) 
    {
        return noOfCharities;
    }
    
    /*
     * This will be the getter function that everyone can call to check the campaign's charityId.
     * Parameters of this function will include uint campaignId
     */
    function getCampaignCharity(
        uint256 campaignId
    )
        public
        view
        returns (uint256)
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        return campaigns[campaignId].charityId;
    }

    /*
     * This will be the getter function that everyone can call to check the campaign name.
     * Parameters of this function will include uint campaignId
     */
    function getCampaignName(
        uint256 campaignId
    )
        public
        view
        returns (string memory)
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        return campaigns[campaignId].campaignName;
    }

    /*
     * This will be the getter function that everyone can call to check the campaign description.
     * Parameters of this function will include uint campaignId
     */
    function getCampaignDescription(
        uint256 campaignId
    )
        public
        view
        returns (string memory)
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        return campaigns[campaignId].description;
    }

    /*
     * This will be the getter function that everyone can call to check the campaign pictureURL.
     * Parameters of this function will include uint campaignId
     */
    function getCampaignPictureURL(
        uint256 campaignId
    )
        public
        view
        returns (string memory)
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        return campaigns[campaignId].pictureURL;
    }

    /*
     * This will be the getter function that everyone can call to check the campaign targetDonation.
     * Parameters of this function will include uint campaignId
     */
    function getCampaignTargetDonation(
        uint256 campaignId
    )
        public
        view
        returns (uint256)
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        return campaigns[campaignId].targetDonation;
    }

    /*
     * This will be the getter function that everyone can call to check the campaign currentDonation.
     * Parameters of this function will include uint campaignId
     */
    function getCampaignCurrentDonation(
        uint256 campaignId
    )
        public
        view
        returns (uint256)
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        return campaigns[campaignId].currentDonation;
    }

    /*
     * This will be the getter function that everyone can call to check the campaign noOfDonors.
     * Parameters of this function will include uint campaignId
     */
    function getCampaignNoOfDonors(
        uint256 campaignId
    )
        public
        view
        returns (uint256)
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        return campaigns[campaignId].noOfDonors;
    }

    /*
     * This will be the getter function that everyone can call to check the campaign startDate.
     * Parameters of this function will include uint campaignId
     */
    function getCampaignStartDate(
        uint256 campaignId
    )
        public
        view
        returns (uint256)
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        return campaigns[campaignId].startDate;
    }

    /*
     * This will be the getter function that everyone can call to check the campaign endDate.
     * Parameters of this function will include uint campaignId
     */
    function getCampaignEndDate(
        uint256 campaignId
    )
        public
        view
        returns (uint256)
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        return campaigns[campaignId].endDate;
    }

    /*
     * This will be the getter function that everyone can call to check the campaign status.
     * Parameters of this function will include uint campaignId
     */
    function getCampaignStatus(
        uint256 campaignId
    )
        public
        view
        returns (CampaignStatus)
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        return campaigns[campaignId].campaignStatus;
    }

    /*
     * This will be the getter function that everyone can call to get the total amounts of the campaigns.
     * There will be no parameters fot this function
     */
    function getNoOfCampaigns() 
        public 
        view 
        returns (uint256) 
    {
        return noOfCampaigns;
    }

    /*
     *This will be the getter function that everyone can call to check the status of the campaign.
     * Parameters of this function will include uint campaignId
     */
    function isStatusComplete(
        uint256 campaignId
    ) 
        public 
        view 
        returns (bool) 
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        if (campaigns[campaignId].campaignStatus == CampaignStatus.ENDED) {
            return true;
        }
        return false;
    }

    /*
     *This will be the getter function that everyone can call to check if the campagin is valid
     * Parameters of this function will include uint campaignId
     */    
    function checkValidCampaign(
        uint256 campaignId
    ) 
        public 
        view 
        returns (bool) 
    {
        if (campaignId < noOfCampaigns) {
            return true;
        }
        return false;
    }

    /*
     * This will be the function that updates the campaign's currentDonation
     * Parameters of this function will include uint campaignId and uint newDonation
     */
    function updateCampaignCurrentDonation(
        uint256 campaignId,
        uint256 newDonation
    ) 
        public 
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        uint256 newAmount = campaigns[campaignId].currentDonation + newDonation;
        campaigns[campaignId].currentDonation = newAmount;
    }

    /*
     * This will be the function that updates the campaign's noOfDonors
     * Parameters of this function will include uint campaignId
     */
    function addCampaignDonor(
        uint256 campaignId
    ) 
        public 
    {
        require(campaignId < noOfCampaigns, "Invalid campaign id");
        uint256 newNumber = campaigns[campaignId].noOfDonors + 1;
        campaigns[campaignId].noOfDonors = newNumber;
    }

    /*
     * This will be the function that returns the charity's donors 
     * Parameters of this function will include uint campaignId
     */
    function getDonors(
        uint256 charityId
    ) 
        public 
        view 
        returns(address[] memory) 
    {
        address[] memory donorList = charities[charityId].donors;
        return donorList;
    }

    /*
     * This will be the function that get charity register fee
     * There will be no parameters for this function
     */
    function getRegFee() public view returns(uint256) {
        return charityRegFee;
    }

    /*
     * This will be the function to get contract's owner
     * There will be no parameters for this function
     */
    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    /*
     * This will be the function to check if donor has donated to charity before
     * Parameters of this function will include address donor, uint charityId
     */
    function checkCharityDonor(
        address donor, 
        uint256 charityId
    ) 
        public 
        view 
        returns (bool) 
    {
        uint length = charities[charityId].donors.length;
        for (uint i = 0; i < length; i++) {
            if(charities[charityId].donors[i] == donor) {
                return true;
            }
        }
        return false;
    }

    /*
     * This will be the function to add a new donor to charity
     * Parameters of this function will include address donor, uint charityId
     */
    function addCharityDonor(
        address donor, 
        uint256 charityId
    ) 
        public 
    {
        charities[charityId].donors.push(donor);
    }
}