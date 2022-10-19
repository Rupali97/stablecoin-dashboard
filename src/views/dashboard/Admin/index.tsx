import {useEffect, useState} from 'react'
import { Button, Card, CardContent, Grid, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useNetwork} from "wagmi"

import Textfield from '../../../components/Textfield'
import { useGetLoader, useUpdateLoader } from '../../../state/application/hooks'
import {useAddOwner, useRemoveOwner, useChangeRequirement, useGetConfirmationCount, useGetSingleTransaction, useGetRequiredCount, useGetOwners} from '../../../hooks/multisig/useMultiSig'
import useSubmitTransaction from '../../../hooks/useSubmitTransaction'
import useCore from '../../../hooks/useCore';
import { ethers } from 'ethers';
import _ from 'lodash';
import useConfirmTxn from '../../../hooks/useConfirmTxn';
import { truncateMiddle } from '../../../utils';
import { PersonalVideo } from '@material-ui/icons';
import ProgressModal from '../../../components/ProgressModal';
import useGetTokenDetails from '../../../hooks/useGetTokenDetails';
import useGetAllTokenDetails from '../../../hooks/useGetAllTokenDetails';
// import useRemoveOwner from '../../../hooks/useRemoveOwner'
// import useChangeNoConfirmations from '../../../hooks/useChangeNoConfirmations'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(id: number, details: any, outOfCount: string, status: string, action: string, hash: []) {
  return { id, details, outOfCount, status, action, hash};
}

// const rows = [
//   createData(0, 'Frozen yoghurt', "1 out of 2", "Needs Confirmation", "Confirm"),
//   createData(1, 'Ice cream sandwich', "1 out of 2", "Needs Confirmation", "Confirm"),
//   createData(2, 'Eclair', "2 out of 2", "Success", ""),
//   createData(3, 'Cupcake', "1 out of 2", "Needs Confirmation", "Confirm"),
//   createData(4, 'Gingerbread', "1 out of 2", "Needs Execution", "Execute"),
// ];

function Admin({adminTxns}) {
  const {provider, tokens, _activeNetwork, contracts, config} = useCore()
  const classes = useStyles();
  const { chain: chainName} = useNetwork()
  console.log("adminTxns", adminTxns)
  const currentLoaderState = useGetLoader()
  const updateLoader = useUpdateLoader()
  let contractOwners: any = useGetOwners()
  
  const [adddressToAdd, setAddressToAdd] = useState<string>('')
  const [adddressRemove, setAddressToRemove] = useState<string>('')
  const [noOfConfirmations, setNoOfConfirmations] = useState<string>("")
  const [finalData, setFinalData] = useState<any[]>([])
  const [tableRows, setTableRows] = useState<any[]>([])

  // const addOwnerAction = useAddOwner(adddressToAdd);
  // const removeOwnerAction = useRemoveOwner(adddressRemove);
  // const noConfirmAction = useChangeRequirement(noOfConfirmations);
  const addOwnerAction = useSubmitTransaction("addOwner", adddressToAdd, '0', contracts[chainName?.id || _activeNetwork].MultiSig.address)
  const removeOwnerAction = useSubmitTransaction("removeOwner", adddressRemove, '0', contracts[chainName?.id || _activeNetwork].MultiSig.address)
  const noConfirmAction = useSubmitTransaction("changeRequirement", "",noOfConfirmations,  contracts[chainName?.id || _activeNetwork].MultiSig.address)
  const setConfirmationCount = useGetConfirmationCount()
  const setIsExecuted = useGetSingleTransaction()
  let confirmReq = useGetRequiredCount()
  const confirmTxnAction = useConfirmTxn()
  const {fetch} = useGetTokenDetails();
  const allTokensTotalSupply = useGetAllTokenDetails()
  console.log("allTokensTotalSupply", allTokensTotalSupply)
  let etherscanUrl = config[chainName?.id || _activeNetwork].etherscanUrl

  useEffect(() => {
    getAllData()

  }, [adminTxns])

  useEffect(() => {
    createRowData()
  }, [finalData])

  const handleAddOwner = () => {
    addOwnerAction(() => {},() => {})
    updateLoader(true)
  }

  const handleRemoveOwner = () => {
    removeOwnerAction(() => {},() => {})
    updateLoader(true)
  }

  const handleChangeConfirmation = () => {
    noConfirmAction(() => {},() => {})
    updateLoader(true)
  }

  const handleConfirm = (id: number, typeOfTxn: string) => {
    confirmTxnAction(id, typeOfTxn)
    updateLoader(true)

  }

  const handleExecute = () => {

  }

  let returnRes

  const getTxnHash = async(hash: any, i: number) => {
        let data, from, blockNumber
        let toAdrs, val, token, typeOfTxn, timestamp, methodID

        const testFn = async() => {
          if(i == 0){
              const res = await provider.getTransaction(hash)
              console.log('useGetTxnFromHash res', res.data)
              data = res.data
              from = res.from
              blockNumber = res.blockNumber

              const blockres = await provider.getBlock(blockNumber)
              timestamp = blockres
              // methodID = data?.slice(0, 10)
              token = data.slice(10, 74)
              token =  `0x${token.slice(24, token.length)}`
              typeOfTxn = data.slice(266, 274)
              toAdrs = data.slice(274, 338)

              if(typeOfTxn == "ba51a6df") val = data.slice(337, 338)
              else {
                val = "0"
              }

              return returnRes = {
                token,
                typeOfTxn: typeOfTxn == "173825d9" ? "removeOwner" : typeOfTxn == "7065cb48" ? "addOwner" : "changeRequirement",
                toAdrs: `0x${toAdrs.slice(24, toAdrs.length)}`,
                from,
                timestamp,
                val
              }
              }else {

                console.log("hash", hash)
                let hashData = await Promise.all(hash.map(async(singleHash) => {
                  const res = await provider.getTransaction(singleHash)
                  blockNumber = res.blockNumber
                  const blockres = await provider.getBlock(blockNumber)
                  timestamp = blockres.timestamp
                  from = res.from
                  return {
                    from, timestamp                      }

                }))
                
                return hashData 
              }
        }
        await testFn().then((res) => 
          {
            returnRes = res
          }
       )

        return returnRes

  }


  const getAllData = () => {
    adminTxns.map(async(item) => {
      console.log("getAllData item", item)
      let submitData = await getTxnHash(item[1].hash[0], 0)
      let confirmData = [] // this should be array of data of confirm hashes / exclueded first (submit) txn hash
      if(item[1].hash.length > 1){

        confirmData = await getTxnHash(item[1].hash.filter((arr, i) => i != 0), 1)
      }
      let _numConfirmations = await setConfirmationCount(item[0])

      const {token, typeOfTxn, toAdrs, from, timestamp, val} = submitData

      const txIndex = item[0]
      const _executed = await setIsExecuted(item[0])

      setFinalData(prev => [...prev, {
        _token: token,
        _typeOfTx: typeOfTxn,
        _to: toAdrs,
        from,
        timestamp,
        txIndex,
        _executed,
        _numConfirmations,
        confirmData,
        hash: item[1].hash,
        val
      }])
    })
  }

  let supply
  const getTotalSupply = (token: string) => {
    

    console.log("getTotalSupply token", token)

    const getTokenDetails = async() => {
      let tokenDetails = await fetch(token)
      console.log("getTotalSupply tokenDetails", tokenDetails)
      return tokenDetails
    }
    
    // getTokenDetails()
    //   .then((res) => {
    //     console.log("getTotalSupply res" , res)
    //     supply = res
    //   })

    // console.log("getTotalSupply supply", supply)

    return supply
  }

  
  // console.log("testSupply", testSupply)


  const createRowData = () => {
    finalData.map((item) => {

      const {token, _typeOfTx, _to, from, txIndex, _executed, _numConfirmations, hash, confirmData, val} = item
      
      let outOfData =  _executed ? `Fullfilled` : `${_numConfirmations} out of ${confirmReq}`
      let details = `Transaction (${_typeOfTx} to ${_typeOfTx == "changeRequirement" ? val : _to}) is Submitted by ${truncateMiddle(from, 12, "...")}.` +
      `${_numConfirmations > 1 ? `Confirmed by ${ truncateMiddle(from, 12, "...") } ${confirmData?.map((data) => "and " + truncateMiddle(data.from, 12, "..."))}` : ""} ${_executed && !!confirmData.length ? `Excuted by ${truncateMiddle(confirmData[confirmData?.length - 1].from, 12, "...")}.` : ""}`
      let status = _executed ? "Success" : _numConfirmations < confirmReq ? 'Needs Confirmation' : 'Needs Execution'
      let action = _executed ? "" : _numConfirmations < confirmReq ? "Confirm" : ""
      const res = createData(txIndex, details, outOfData, status, action, hash)
      setTableRows(prev => _.uniqWith([...prev, res], _.isEqual))
    })
  }
  console.log("tableRows", tableRows)
  console.log("finalData", finalData)
  // return <div />
  return (
    <div style={{marginLeft: '260px', marginRight: '20px', position: 'relative', paddingTop: '50px'}}>
      <ProgressModal currentLoaderState={currentLoaderState} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Textfield
                text={'Total Supply'}
                fontSize={'20px'}
                fontWeight={'bold'}
                className={'m-b-15'}
              />
              <Grid item xs={2}>
                {
                  allTokensTotalSupply && allTokensTotalSupply?.map((item, i) => (
                    <div className={"row-spacebetween-center"} key={i}>
                      <Textfield
                        text={item.symbol + ":"}
                        fontSize={'15px'}
                        fontWeight={'500'}
                        className={'m-b-15'}
                      />
                      <Textfield
                        text={item.totalSupply}
                        fontSize={'15px'}
                        fontWeight={'bold'}
                        className={'m-b-15'}
                      />
                    </div>
                  ))
                }
                
              </Grid>
             
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{marginBottom: '30px'}}>

            <CardContent>
              <Textfield
                text={'Add an owner'}
                fontSize={'20px'}
                fontWeight={'bold'}
                className={'m-b-15'}
              />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    helperText="Enter the address to which you want to add as an owner"
                    required
                    label="Address"
                    // margin="dense"
                    type="text"
                    onChange={(e:any) => setAddressToAdd(e.target.value)}
                    value={adddressToAdd}
                    fullWidth
                    // variant="outlined"
                    size={'small'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={handleAddOwner}
                    variant="contained"
                    color="primary"
                    fullWidth
                    // disabled={!disableMint}
                    style={{position: 'relative'}}>Submit
                  </Button> 
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{marginBottom: '30px'}}>
            <CardContent>
              <Textfield
                text={'Remove an owner'}
                fontSize={'20px'}
                fontWeight={'bold'}
                className={'m-b-15'}
              />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    helperText="Enter the address to which you want to remove as an owner"
                    required
                    label="Address"
                    // margin="dense"
                    type="text"
                    onChange={(e:any) => setAddressToRemove(e.target.value)}
                    value={adddressRemove}
                    fullWidth
                    // variant="outlined"
                    size={'small'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={handleRemoveOwner}
                    variant="contained"
                    color="primary"
                    fullWidth
                    // disabled={!disableMint}
                    style={{position: 'relative'}}>Submit
                  </Button> 
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{marginBottom: '30px'}}>
            <CardContent>
              <Textfield
                text={'Change the number of confirmations'}
                fontSize={'20px'}
                fontWeight={'bold'}
                className={'m-b-15'}
              />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    helperText={`Enter the count that needs to be updated. Current count: ${confirmReq}`}
                    required
                    label="Confirmation count"
                    // margin="dense"
                    type="text"
                    onChange={(e:any) => setNoOfConfirmations(e.target.value)}
                    value={noOfConfirmations}
                    fullWidth
                    // variant="outlined"
                    size={'small'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    onClick={handleChangeConfirmation}
                    variant="contained"
                    color="primary"
                    fullWidth
                    // disabled={!disableMint}
                    style={{position: 'relative'}}>Change
                  </Button> 
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card style={{marginBottom: '30px', maxHeight: '200px', height: '200px'}} className={"scrollable"}>
            <CardContent>
              <Textfield
                text={'Current Owners list'}
                fontSize={'20px'}
                fontWeight={'bold'}
                className={'m-b-15'}
              />
              <div className={"scrollable"}>
                {
                  contractOwners.map((owner, i) => 
                    <Textfield
                      key={i}
                      text={`${i+1}. ${owner}`}
                      fontSize={'13px'}
                      // fontWeight={'bold'}
                      className={'m-b-15'}
                    />
                  )
                }
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Details</TableCell>
                      <TableCell align="right">Confirmation Count</TableCell>
                      <TableCell align="right">Staus</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {_.uniqWith(tableRows, (arrVal, othVal) => arrVal.id == othVal.id).sort((a, b) => b.id - a.id)?.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell component="th" scope="row">
                          {row.details}
                          {
                            row.action.length ? 
                            <div style={{margin: '15px 0 15px 0'}}>
                                <Button onClick={() => {
                                if(row.action == "Confirm") handleConfirm(row.id, row._typeOfTx)
                                else handleExecute()
                              }}>{row.action}</Button>
                            </div>
                            : 
                            <div />
                          }
                          Click on the links for more details. &nbsp;&nbsp;
                          {
                            row.hash.map((singleHash, i) => 
                              <span key={i}><a target="_blank" href={`${etherscanUrl}/tx/${singleHash}`}> {truncateMiddle(singleHash, 22, "...")}</a>
                              &nbsp;&nbsp;</span>
                            )
                          }
                        </TableCell>
                        <TableCell align="right">{row.outOfCount}</TableCell>
                        <TableCell align="right">{row.status}</TableCell>
                        {/* {
                          row.action.length ? 
                          <TableCell align="right">
                              <Button onClick={() => {
                              if(row.action == "Confirm") handleConfirm(row.id, row._typeOfTx)
                              else handleExecute()
                            }}>{row.action}</Button>
                          </TableCell>
                          : 
                          <div />
                        } */}
                        
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}

export default Admin