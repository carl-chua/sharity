import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

import EnhancedTable from "../components/EnhancedTable";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function TransactionHistory({
  web3,
  accounts,
  charityContract,
  donationContract,
  isAuthed,
}) {
  const classes = useStyles();
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
      await setTransactions(transactions);
    })();
  }, []);

  return (
    <Box mt={10}>
      <Grid container spacing={5} justify="center">
        <Grid item xs={10}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Transaction id</TableCell>
                  <TableCell align="right">Campaign</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={10}>
          <EnhancedTable title={"Transaction history"} data={transactions} />
        </Grid>
      </Grid>
    </Box>
  );
}
