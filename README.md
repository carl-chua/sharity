# Sharity
IS4302 Group 5

#Installing Metamask
1. To use Sharity, you would need to install the Metamask Chrome extension at: https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en

#Running the project
1. Go into the project folder /sharity, and npm install
2. Go into the subfolder /sharity/client, and npm install
3. From /sharity/client, npm start
4. Open browser at http://localhost:3000

#Accessing Sharity as a Donor
1. View the list of verified charities, and the details of each charity
2. View the ongoing and past campaigns created
3. View campaign details, including all donations made to campaign
4. Donate to a campaign
5. View all personal donations made within the platform

#Accessing Sharity as a Charity representative
1. Register charity and provide all necessary information for verification. A registration fee of 0.5 ether is required.
2. (Upon successful verification) Create campaign
3. End campaign


#In case you need to redeploy the contracts and reset the blockchain data
1. Delete the .json files in /sharity/client/contracts
2. Go into project folder /sharity and do a truffle migrate --network ropsten. 
