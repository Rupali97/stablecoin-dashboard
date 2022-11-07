import { useEffect, useState } from 'react'
import { Button, Card, CardContent, Grid, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useNetwork } from "wagmi"
import {useMediaQuery} from "react-responsive";

import Textfield from '../../../components/Textfield'
import { useGetLoader, useUpdateLoader } from '../../../state/application/hooks'
import { useAddOwner, useRemoveOwner, useChangeRequirement, useGetConfirmationCount, useGetSingleTransaction, useGetRequiredCount, useGetOwners } from '../../../hooks/multisig/useMultiSig'
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
import useSubmit from '../../../hooks/tron/useSubmit';
import { useGetActiveBlockChain, useGetActiveChainId } from '../../../state/chains/hooks';
import useConfirm from '../../../hooks/tron/useConfirm';
import { tronMultiSigContract } from '../../../utils/constants';
import useGetTronTokenDetails from '../../../hooks/tron/useGetTronTokenDetails';
import useGetTronOwners from '../../../hooks/tron/useGetTronOwners';
import { useGetTronConfirmationCount, useTronGetIsExecuted, useTronGetRequiredCount } from '../../../hooks/tron/useTronMultisig';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function createData(id: number, details: any, outOfCount: string, status: string, action: string, hash: string[]) {
  return { id, details, outOfCount, status, action, hash };
}

function Admin({ ethTxns, tronTxns }) {
  const isMobile = useMediaQuery({maxWidth: '600px'});
  const { provider, tokens, _activeNetwork, contracts, config } = useCore()
  const classes = useStyles();
  const { chain: chainName } = useNetwork()

  const currentLoaderState = useGetLoader()
  const updateLoader = useUpdateLoader()
  let contractOwners: any = useGetOwners()
  const chain = useGetActiveBlockChain()

  const [adddressToAdd, setAddressToAdd] = useState<string>('')
  const [adddressRemove, setAddressToRemove] = useState<string>('')
  const [noOfConfirmations, setNoOfConfirmations] = useState<string>("")
  const [finalData, setFinalData] = useState<any[]>([])
  const [finalEthTxns, setFinalEthTxns] = useState<any>([])
  const [finalTronTxns, setFinalTronTxns] = useState<any>([])

  // Ethereum blockchain
  const addOwnerAction = useSubmitTransaction("addOwner", adddressToAdd, '0', "MultiSig")
  const removeOwnerAction = useSubmitTransaction("removeOwner", adddressRemove, '0', "MultiSig")
  const noConfirmAction = useSubmitTransaction("changeRequirement", "", noOfConfirmations, "MultiSig")
  const setConfirmationCount = useGetConfirmationCount()
  const setIsExecuted = useGetSingleTransaction()
  let confirmReq = useGetRequiredCount()
  const confirmTxnAction = useConfirmTxn()
  const { fetch } = useGetTokenDetails();
  const allTokensTotalSupply = useGetAllTokenDetails()
  const chaindId = useGetActiveChainId()
  
  // Tron blockchain
  const addTronOwnerAction = useSubmit("addOwner", adddressToAdd, '0', tronMultiSigContract)
  const removeTronOwnerAction = useSubmit("removeOwner", adddressRemove, '0', tronMultiSigContract)
  const noConfirmActionTron = useSubmit("changeRequirement", "", noOfConfirmations, tronMultiSigContract)
  const confirmTronTxnAction = useConfirm()
  const allTronTokensTotalSupply = useGetTronTokenDetails()
  const tronContractOwners = useGetTronOwners()
  const confirmTronRequired = useTronGetRequiredCount()
  const numOfConfirmationCountTron = useGetTronConfirmationCount()
  const isTronExecuted = useTronGetIsExecuted()

  let etherscanUrl = config[chainName?.id || _activeNetwork].etherscanUrl
 
  useEffect(() => {
    sortTransactions()
  }, [ethTxns, tronTxns, chain])

  const handleAddOwner = () => {
    if(chain == "Nile"){
      addTronOwnerAction()
    }else {
      addOwnerAction(() => { }, () => { })
    }
    updateLoader(true)
  }

  const handleRemoveOwner = () => {
    if(chain == "Nile"){
      removeTronOwnerAction()
    }else {
      removeOwnerAction(() => { }, () => { })
    }
    updateLoader(true)
  }

  const handleChangeConfirmation = () => {
    if(chain == "Nile"){
      noConfirmActionTron()
    }else{
      noConfirmAction(() => { }, () => { })
    }
    updateLoader(true)
  }

  const handleConfirm = (id: number, typeOfTxn: string) => {
    if(chain == "Nile"){
      confirmTronTxnAction(id)
    }else{
      confirmTxnAction(id, typeOfTxn)
    }
    updateLoader(true)

  }

  const handleExecute = () => {}

  const sortTransactions = () => {

    const mutlisigAddr = contracts[chaindId].MultiSig.address.replace('0x', '').toLowerCase()

    let arr1: any[] = []
    let arr2: any[] = []

    ethTxns?.map((item: any, i: number) =>  {
      if (item.submitResponse.input.toLowerCase().includes(mutlisigAddr)) {
        arr1.push(item)
      }
    })


    let token, value, symbol, toAdrs, typeOfTxn, typeOfTxnID


    arr1?.map(async(item: any, i: number) => {
      const executed = await setIsExecuted(Number(item.index))
      let numConfirmations = await setConfirmationCount(Number(item.index))

      token = item.submitResponse.input.slice(10, 74)
      token =  `0x${token.slice(24, token.length)}`
      toAdrs = item.submitResponse.input.slice(274, 338)
      toAdrs = `0x${toAdrs.slice(24, toAdrs.length)}`
      typeOfTxnID = item.submitResponse.input.slice(266, 274)

      if (typeOfTxnID == "ba51a6df") value = item.submitResponse.input.slice(337, 338)
      else {
        value = "0"
      }
      if(typeOfTxnID == "173825d9") typeOfTxn = "removeOwner"
      if(typeOfTxnID == "7065cb48") typeOfTxn = "addOwner"
      if(typeOfTxnID == "ba51a6df") typeOfTxn = "changeRequirement"
      arr2.push({...item, token, value, toAdrs, typeOfTxn, executed, numConfirmations})

      setFinalEthTxns(arr2)
          
    }) 
    
    let tronArr1: any[] = []
    tronTxns?.map((item: any, i: number) =>  {
      if (item.submitResponse.input.toLowerCase().includes(window.tronWeb?.address.toHex(tronMultiSigContract).toLowerCase().slice(2, window.tronWeb?.address.toHex(tronMultiSigContract).length))) {
        tronArr1.push(item)

      }
    })

    let tronArr2: any[] = []

    tronArr1?.forEach(async(item: any, i: number) => {
      const executed = await isTronExecuted(Number(item.index))
      let numConfirmations = await numOfConfirmationCountTron(item.index)
      token = item.submitResponse.input.slice(8, 72)
      token =  window.tronWeb?.address.fromHex(`41${token.slice(24, token.length)}`)
      toAdrs = item.submitResponse.input.slice(272, 336)
      toAdrs = window.tronWeb?.address.fromHex(`41${toAdrs.slice(24, toAdrs.length)}`)
      typeOfTxnID = item.submitResponse.input.slice(264, 272)

      if (typeOfTxnID == "ba51a6df") value = item.submitResponse.input.slice(336, 337)
      else {
        value = "0"
      }
      if(typeOfTxnID == "173825d9") typeOfTxn = "removeOwner"
      if(typeOfTxnID == "7065cb48") typeOfTxn = "addOwner"
      if(typeOfTxnID == "ba51a6df") typeOfTxn = "changeRequirement"
      tronArr2.push({...item, token, value, toAdrs, typeOfTxn, executed, numConfirmations})

      setFinalTronTxns(tronArr2)
    })
   
  }

  const disableChangeConfirmCount = noOfConfirmations && noOfConfirmations < tronContractOwners.length && noOfConfirmations != "0"
  const disableAddOwner = chain == "Goerli" ? ethers.utils.isAddress(adddressToAdd) : window.tronWeb?.isAddress(adddressToAdd)
  const disableRemoveOwner = chain == "Goerli" ? ethers.utils.isAddress(adddressRemove) : window.tronWeb?.isAddress(adddressRemove)
  console.log("finalEthTxns", finalEthTxns, finalTronTxns)
  
  // return (<div></div>)
  return (
    <div style={{ marginLeft: isMobile ? "20px" : '260px', marginRight: '20px', position: 'relative', paddingTop: '50px' }}>
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
                  chain == "Goerli" ? allTokensTotalSupply && allTokensTotalSupply?.map((item, i) => (
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
                  )) :

                  allTronTokensTotalSupply && allTronTokensTotalSupply?.map((item, i) => (
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
        <Grid item xs={12} md={6}>
          <Card style={{ marginBottom: '30px' }}>

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
                    helperText="Enter the valid address you want to add as an owner"
                    required
                    label="Address"
                    // margin="dense"
                    type="text"
                    onChange={(e: any) => setAddressToAdd(e.target.value)}
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
                    disabled={!disableAddOwner}
                    style={{ position: 'relative' }}>Submit
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ marginBottom: '30px' }}>
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
                    helperText="Enter the valid address you want to remove as an owner"
                    required
                    label="Address"
                    // margin="dense"
                    type="text"
                    onChange={(e: any) => setAddressToRemove(e.target.value)}
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
                    disabled={!disableRemoveOwner}
                    style={{ position: 'relative' }}>Submit
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ marginBottom: '30px' }}>
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
                    helperText={`Enter the count that needs to be updated. Current count: ${chain == "Goerli" ? confirmReq : confirmTronRequired}`}
                    required
                    label="Confirmation count"
                    // margin="dense"
                    type="text"
                    onChange={(e: any) => setNoOfConfirmations(e.target.value)}
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
                    disabled={!disableChangeConfirmCount}
                    style={{ position: 'relative' }}>Change
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ marginBottom: '30px', maxHeight: '200px', height: '200px' }} className={"scrollable"}>
            <CardContent>
              <Textfield
                text={'Current Owners list'}
                fontSize={'20px'}
                fontWeight={'bold'}
                className={'m-b-15'}
              />
              <div className={"scrollable"}>
                {
                  chain == "Goerli" ?
                  contractOwners.map((owner, i) =>
                    <Textfield
                      key={i}
                      text={`${i + 1}. ${owner}`}
                      fontSize={'13px'}
                      // fontWeight={'bold'}
                      className={'m-b-15'}
                    />
                  ) :

                  tronContractOwners.map((owner, i) =>
                    <Textfield
                      key={i}
                      text={`${i + 1}. ${owner}`}
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
                    {_.uniqWith(chain == "Goerli" ? finalEthTxns : finalTronTxns, (arrVal: any, othVal: any) => arrVal.index == othVal.index).sort((a, b) => b.index - a.index)?.map((row) => {
                      const {confirmData, executed, index, numConfirmations, submitResponse, toAdrs, token, typeOfTxn, value} = row
                      let confirmCount = chain == "Goerli" ? confirmReq : confirmTronRequired
                      let action = executed ? "" : numConfirmations <  confirmCount ? "Confirm" : ""
                      let confirmHash = confirmData ? confirmData?.map((item) => item.hash) : []
                      let hash = [submitResponse.hash].concat(confirmHash)
                      let details = `Transaction (${typeOfTxn} to ${typeOfTxn == "changeRequirement" ? value : toAdrs}) is Submitted by ${truncateMiddle(submitResponse.from, 12, "...")}.` +
                      `${numConfirmations > 1 ? `Confirmed by ${truncateMiddle(submitResponse.from, 12, "...")} ${confirmData?.map((data) => "and " + truncateMiddle(data.from, 12, "..."))}` : ""} ${executed && !!confirmData?.length ? `Excuted by ${truncateMiddle(confirmData[confirmData?.length - 1].from, 12, "...")}.` : ""}`
                      return(
                        <TableRow key={index}>
                          <TableCell>{index}</TableCell>
                          <TableCell component="th" scope="row">
                            {details}
                            {
                              action.length ?
                                <div style={{ margin: '15px 0 15px 0' }}>
                                  <Button onClick={() => {
                                    if (action == "Confirm") handleConfirm(index, typeOfTxn)
                                    else handleExecute()
                                  }}>{action}</Button>
                                </div>
                                :
                                <div />
                            }
                            Click on the links for more details. &nbsp;&nbsp;
                            {
                              hash.map((singleHash, i) =>
                                <span key={i}><a target="_blank" href={chain == "Goerli" ? `${etherscanUrl}/tx/${singleHash}` : `https://nile.tronscan.org/#/transaction/${singleHash}`} rel="noreferrer"> {truncateMiddle(singleHash, 22, "...")}</a>
                                  &nbsp;&nbsp;</span>
                              )
                            }
                          </TableCell>
                          <TableCell align="right"> { executed ? `Fullfilled` : `${numConfirmations} out of ${chain == "Goerli" ? confirmReq : confirmTronRequired}` } </TableCell>
                          <TableCell align="right">{ executed ? "Success" : numConfirmations < confirmCount ? 'Needs Confirmation' : 'Needs Execution' }</TableCell>
                        </TableRow>
                      )
                    }
                    
                    )}
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
