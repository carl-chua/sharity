import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import EnhancedTable from "../components/EnhancedTable";

export default function TransactionHistory({
  web3,
  accounts,
  charityContract,
  donationContract,
  isAuthed,
}) {
  const [transactions, setTransactions] = useState();

  var getTransactions = async (address) => {
    const noOfTransactions = await donationContract.methods
      .getDonorTotalDonations(address)
      .call();
    var transactions = [];
    for (let i = 0; i < noOfTransactions; i++) {
      // transaction id, donor address, campaign id, donated amount, date, transaction hash
      var transaction = await donationContract.methods
        .getDonorDonation(address, i)
        .call();
      var transactionObject = {};
      transactionObject.transactionId = transaction["0"];
      transactionObject.donorAddress = transaction["1"];
      transactionObject.campaignId = transaction["2"];
      transactionObject.donatedAmount = transaction["3"];
      transactionObject.date = transaction["4"];
      transactionObject.hash = transaction["5"];
      transactionObject.campaignName = await charityContract.methods
        .getCampaignName(transactionObject.campaignId)
        .call();
      console.log(transactionObject);
      transactions.push(transactionObject);
    }
    return transactions;
  };

  useEffect(() => {
    (async () => {
      var transactions = await getTransactions(accounts[0]);
      setTransactions(transactions);
    })();
  }, []);

  const rows = [
    {
      hash:
        "0x0dd6d3ffc25715716ebbc8ef347e33242400d86f08d5a9151dd795ce7ed46982",
      campaignName: "campaigasd",
      date: "20200412",
      donatedAmount: 1,
    },
    {
      hash:
        "0x0dd6d3ffc25715716ebbc8ef347e33242400d86f08d5a9151dd795ce7ed46982",
      campaignName: "casdasdas",
      date: "20200411",
      donatedAmount: 2,
    },
    {
      hash:
        "1x0dd6d3ffc25715716ebbc8ef347e33242400d86f08d5a9151dd795ce7ed46982",
      campaignName: "aasdasdas",
      date: "20200413",
      donatedAmount: 3,
    },
  ];

  return (
    <Box mt={10}>
      <Grid container spacing={5} justify="center">
        <Grid item xs={10}>
          {transactions && (
            <EnhancedTable title={"Transaction history"} rows={rows} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
