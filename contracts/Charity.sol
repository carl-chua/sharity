pragma solidity ^0.5.0;

contract Charity {

  enum CharityStatus {
	  UNVERIFIED, VERIFIED
  }

  enum CampaignStatus {
	  ONGOING, ENDED
  }

  struct charity {
	  address charityOwner;
    bytes32 charityName;
    bytes32 description;
    bytes32 pictureURL;
    CharityStatus charityStatus;
  }

  struct campaign {
    uint charityId;
    bytes32 campaignName;
    bytes32 description;
    bytes32 pictureURL;
    uint targetDonation;
    uint currentDonation;
    uint noOfDonors;
    uint startDate;
    uint endDate;
    CampaignStatus campaignStatus;
  }

  address contractOwner;
  uint[] charitiesPendingVerification;
  mapping(uint => bool) isVerifiedCharity;
  mapping(uint => charity) charities;
  uint noOfCharities = 1;

  uint[] ongoingCampaigns;
  mapping(uint => bool) isOngoingCampaign;
  mapping(uint => campaign) campaigns;
  uint noOfCampaigns = 1;

  modifier onlyOwner(address caller) {
    require(caller == contractOwner, "Caller is not contract owner");
    _;
  }


  // This will be the modifier that checks whether the function call is done by the Charity itself.
  modifier onlyVerifiedCharity(address caller) {
    require(isVerifiedCharity[caller], "Caller is not a valid charity");
    _;
  }

  function registerCharity(bytes32 charityName, bytes32 description, bytes32 pictureURL) returns (uint charityId) {
    require(charityName != "Charity name cannot be empty");
    require(description != "Description cannot be empty");
    require(pictureURL != "Picture URL cannot be empty");

    charityId = noOfCharities++;
    charity memory newCharity = charity(msg.sender, charityName, description, pictureURL, CharityStatus.UNVERIFIED);
    charities[charityId] = newCharity;
    charitiesPendingVerification.push(charityId);
    return charityId;
  }

  function verifyCharity(uint charityId) onlyOwner(msg.sender) {
    require(msg.sender == contractOwner, "Caller is not contract owner");
    require(charityId < noOfCharities, "Invalid charity id");
    require(isVerifiedCharity[charityId] == false, "Charity has been verified");

    charities[charityId].charityStatus = CharityStatus.VERIFIED;
    isVerifiedCharity[charityId] = true;
    // remove charity from charitiesPendingVerification[]
  }

  /*
  * This will be the function that charities call to create a campaign.
  * Parameters of this function will include uint targetDonation (of the campaign), uint startDate (of the campaign), uint endDate (of the campaign)
  */
  function createCampaign(bytes32 campaignName, bytes32 description, bytes32 pictureURL, uint targetDonation, uint startDate, uint endDate) onlyVerifiedCharity(msg.sender) returns (uint campaignId) {
    require(campaignName != "Charity name cannot be empty");
    require(description != "Description cannot be empty");
    require(pictureURL != "Picture URL cannot be empty");
    require(targetDonation > 0, "Target donation must be larger than 0");
    require(startDate < endDate, "Start date must be earlier than end date");

    campaignId = noOfCampaigns++;
    campaign memory newCampaign = campaign(campaignName, description, pictureURL, targetDonation, 0, 0, startDate, endDate, CampaignStatus.ONGOING);
    campaigns[campaignId] = newCampaign;
    ongoingCampaigns.push(campaignId);
    isCampaign[campaignId] = true;
    return campaignId;
  }

  /*
  *
  * This will be the function that charities call to end an ongoing campaign.
  * Parameters of this function will include uint campaignId
  */
  function endCampaign(uint campaignId) onlyVerifiedCharity(msg.sender) {
    require(campaignId < noOfCampaigns, "Invalid campaign id");
    require(isOngoingCampaign[campaignId], "Campaign is not ongoing");
    require(msg.sender = charities[campaigns[campaignId].charityId].charityOwner, "Caller is not owner of charity");

    campaigns[campaignId].campaignStatus = CampaignStatus.ENDED;
    isOngoingCampaign[campaignId] = false;
    // remove campaign from ongoingCampaigns[]
  }

}