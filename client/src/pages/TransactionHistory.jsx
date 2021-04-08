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
      // transaction id, donor address, campaign id, donated amount
      var transaction = await donationContract.methods
        .getDonorDonation(address)
        .call();
      console.log(transaction);
      transactions.push(transaction);
    }
    return transactions;
  };

  useEffect(() => {
    (async () => {
      var transactions = await getTransactions(accounts[0]);
      setTransactions(transactions);
    })();
  }, []);

  return (
    <Box mt={10}>
      <Grid container spacing={5} justify="center">
        <Grid item xs={10}>
          <EnhancedTable title={"Transaction history"} data={transactions} />
        </Grid>
      </Grid>
    </Box>
  );
}
