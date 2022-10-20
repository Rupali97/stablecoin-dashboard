import { useEffect, useState } from 'react'
import Icon from "@material-ui/core/Icon"
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import _moment from "moment"
import {Button} from "@material-ui/core";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import {useNetwork} from "wagmi"
import _ from "lodash"
import Steps from './Steps'
import Textfield from './Textfield';
import { truncateMiddle } from '../utils';
// import { tronWeb } from '../views/dashboard/TestTron';

import { formatToBN, getBalance, getDisplayBalance } from '../utils/formatBalance';
import useCore from '../hooks/useCore';
import useConfirmTxn from '../hooks/useConfirmTxn';
import { BigNumber, ethers } from 'ethers';
import useGetConfirmReq from '../hooks/useGetConfirmReq';
import useExecuteTxn from '../hooks/useExecuteTxn';
import useConfirm from '../hooks/tron/useConfirm';
import useExecute from '../hooks/tron/useExecute';
import useNoOfConfimReq from '../hooks/tron/useNoOfConfimReq';
import { useGetActiveBlockChain } from '../state/chains/hooks';
import { useGetLoader, useUpdateLoader } from '../state/application/hooks';
import { useGetRequiredCount, useGetSingleTransaction, useGetOwners, useGetConfirmationCount, useGetTxnFromHash } from '../hooks/multisig/useMultiSig';
import useGetTokenDetails from '../hooks/useGetTokenDetails';
import ProgressModal from './ProgressModal';


function ConfirmationStep({allTransactions}) {
      const core = useCore()

      const {myAccount, provider, config, _activeNetwork } = core
      const { chain: chainName} = useNetwork()

      const chain = useGetActiveBlockChain()
      const updateLoader = useUpdateLoader()
      const currentLoaderState = useGetLoader()
      const {fetch} = useGetTokenDetails();

      const [finalData, setFinalData] = useState<any[]>([])
      const [txnData, setTxnData] = useState<any[]>([])

      // maticMumbai network
      let testOwners: any = useGetOwners()
      let confirmReq = useGetRequiredCount()
      const disableConfirm = testOwners?.includes(myAccount)
      const confirmTxnAction = useConfirmTxn()
      const executeTxAction = useExecuteTxn()
      const setIsExecuted = useGetSingleTransaction()
      const getTxnFromHash = useGetTxnFromHash()
      const setConfirmationCount = useGetConfirmationCount()
      let etherscanUrl = config[chainName?.id || _activeNetwork].etherscanUrl

      // const {_numConfirmations, setNumConfirmations} = useGetConfirmationCount()
      
      // Nile network
      let noOfConfirmReq = useNoOfConfimReq()
      const confirmTronTxnAction = useConfirm()
      const executeTronTxnAction = useExecute()

      useEffect(() => {
            getAlltheData()
            console.log("useEffectConfirmationStep allTransactions", allTransactions)
      }, [allTransactions])

      const ConfirmTxn = (txIndex: number, _typeOfTx: string) => {

            updateLoader(true)

            if(chain != "MaticMumbai"){
                  confirmTronTxnAction(txIndex)  
            }else{
                  confirmTxnAction(txIndex, _typeOfTx)
            }

      }

      const executeTxn = (txIndex: number, _typeOfTx: string) => {
            updateLoader(true)

            if(chain != "MaticMumbai"){
                  executeTronTxnAction(txIndex)  
            }else{
                  executeTxAction(txIndex, _typeOfTx)
            }

      }

      const getDate = (val: number) => {
            let timestamp = val
            let date = _moment.unix(timestamp).utc().format("MMM Do YYYY h:mm:ss a");
            if(timestamp == 0) return 'N/A'
            return `${date}`
      }

      const timeAgo = (val: number) => {
            let timestamp = val  
            let date = _moment.unix(timestamp).fromNow();

            return date
      }

      const activeStepHandler = (confirmCount, isExecuted) => {

            if(chain == "MaticMumbai"){
                  if(isExecuted) return 3
                  else if(confirmCount < confirmReq) return 1
                  else if(confirmCount == confirmReq) return 2
                  else return
            }else{
                  if(isExecuted) return 3
                  else if(confirmCount < noOfConfirmReq) return 1
                  else if(confirmCount == noOfConfirmReq) return 2
                  else return 
            }
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
                        timestamp = blockres.timestamp

                        methodID = data?.slice(0, 10)
                        token = data.slice(10, 74)
                        token =  `0x${token.slice(24, token.length)}`
                        typeOfTxn = data.slice(266, 274)
                        toAdrs = data.slice(274, 338)
                        val = data.slice(338, 402) 

                        let tokenDetails = await fetch(token)
                        console.log("tokenDetails", tokenDetails)

                        return returnRes = {
                              methodID,
                              token: {
                                    address: token,
                                    symbol: tokenDetails?.value.symbol,
                                    balance: tokenDetails?.value.balance
                              },
                              typeOfTxn: typeOfTxn == "40c10f19" ? "Mint" : "Burn",
                              toAdrs: `0x${toAdrs.slice(24, toAdrs.length)}`,
                              val: ethers.utils.formatEther(`0x${val}`),
                              from,
                              timestamp
                        }
                  }else {

                        let hashData = await Promise.all(hash.map(async(singleHash) => {
                              const res = await provider.getTransaction(singleHash)
                              blockNumber = res.blockNumber
                              const blockres = await provider.getBlock(blockNumber)
                              timestamp = blockres.timestamp
                              from = res.from
                              return { from, timestamp }
        
                        }))

                        console.log('hashData', hashData)

                        return hashData 
                  }

  
            }
            await testFn().then((res) => 
                  {
                        returnRes = res
                  }
           )

            console.log('updater returnRes', returnRes)
            return returnRes

      }

      const getAlltheData = () => {

            console.log("updater getAlltheData", allTransactions)

            _.uniqWith(allTransactions)
                  .map(async(item: any, i) => {
                        
                        let submitData = await getTxnHash(item[1].hash[0], 0)
                        let confirmData = [] 
                        if(item[1].hash.length > 1) {
                              confirmData = await getTxnHash(item[1].hash.filter((arr, i) => i != 0), 1)
                        }else {
                              confirmData = await getTxnHash(item[1].hash, 1)
                        }

                        console.log("confirmData", confirmData)

                        let _numConfirmations = await setConfirmationCount(item[0])
                        console.log("_numConfirmations", _numConfirmations)
                        console.log('submitData', submitData)
                        const {token, typeOfTxn, toAdrs, val: _value, from, timestamp} = submitData
                        // const {from: confirmAndexecuteFrom, timestamp: confirmAndexecuteTime} = confrimData

                        const txIndex = item[0]
                        const _executed = await setIsExecuted(item[0])
                        console.log("_executed", _executed)

                        setFinalData(prev => [...prev, {
                              _token: token,
                              _typeOfTx: typeOfTxn,
                              _to: toAdrs,
                              _value,
                              from,
                              timestamp,
                              txIndex,
                              _executed,
                              _numConfirmations,
                              confirmData,
                              hash: item[1].hash
                        }])
                  })
      }

      console.log("updater finalData", finalData)

//   return <div />
  return (
      <div>
            <ProgressModal currentLoaderState={currentLoaderState} />
            <Textfield
                  text={'Transactions'}
                  fontSize={'24px'}
                  fontWeight={'bold'}
                  className={'m-b-15'}
            />
            {
                   _.uniqWith(finalData, (arrVal, othVal) => arrVal.txIndex == othVal.txIndex)?.sort((a, b) => b.txIndex - a.txIndex).map((item: any, i) => {
                        const {from, timestamp: _createdTime, _typeOfTx, _value, _token, _to, _executed, txIndex, _numConfirmations, hash, confirmData} = item
                        const {address: tokenAdrs, symbol: tokenSymbol, balance: tokenBal} = _token
                        return(
                              <Accordion key={i} style={{marginBottom: '16px'}}>
                                    <AccordionSummary
                                          // expandIcon={<ExpandMoreIcon />}
                                          >
                                          <div
                                                className={'grid-item header'}   
                                                style={{width: '100%'}}                                 
                                          >
                                                <div>
                                                      <Textfield 
                                                            text={txIndex}
                                                            color={'#333'}
                                                            fontSize={'16px'}    
                                                      />
                                                </div>
                                                <div>
                                                      <Textfield 
                                                            text={`${_typeOfTx} (${_value} ${tokenSymbol})`}
                                                            color={'#333'}
                                                            fontSize={'16px'}
                                                      />
                                                </div>
                                                <div>
                                                      <Textfield 
                                                            text={`${timeAgo(_createdTime)}`}
                                                            color={'#333'}
                                                            fontSize={'16px'}
                                                      />
                                                </div>
                                                <div className='row-left-center'>
                                                      <div><Icon className='m-r-5 headerIcon'>supervisor_account</Icon> </div>
                                                      <Textfield 
                                                            text={ _executed ? `Fullfilled` : `${_numConfirmations} out of ${confirmReq}`}
                                                            color={'#aaa'}
                                                            fontSize={'14px'}
                                                            fontWeight={'bold'}
                                                      />
                                                </div>
                                                <div style={{width: '180px'}} className={"row-allcenter"}>
                                                      <Textfield 
                                                            text={`${
                                                                  chain == 'MaticMumbai' ? 
                                                                  _executed ? "Success" : _numConfirmations < confirmReq ? 'Needs Confirmation' : 'Needs Execution' :
                                                                  _numConfirmations < noOfConfirmReq ? 'Needs Confirmation' : !_executed ? 'Needs Execution' : 'Success'}`}
                                                            // color={'#ed7117'}
                                                            color={`${
                                                                  chain == 'MaticMumbai' ? 
                                                                  // _numConfirmations < confirmReq ? '#FF4500' : !_executed ? '#FF4500' : '#228B22' :
                                                                  _executed ? '#228B22' : _numConfirmations < confirmReq ? '#FF4500' : "" :
                                                                  _numConfirmations < noOfConfirmReq ? '#FF4500' : !_executed ? '#FF4500' : '#228B22'}`}
                                                            fontSize={'14px'}
                                                            fontWeight={'bold'}
                                                      />
                                                      
                                                </div>  
                                                <div>&nbsp; &nbsp; <KeyboardArrowUpIcon /> </div>
                                          </div>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                          <div className='flex' style={{width: '100%'}}>
                                                <div style={{flex: 3, display: 'flex', flexDirection: 'column'}}>
                                                      <div className="grid-item flex1">
                                                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                            <Textfield 
                                                                  text={`${_typeOfTx} ${_value} ${tokenSymbol} (${ truncateMiddle(tokenAdrs, 12, '...')}) to ${_to}`}
                                                                  color={'#000'}
                                                                  fontSize={'15px'}
                                                                  className={'m-b-15'}
                                                                  fontWeight={'bold'}
                                                            />
                              
                                                                  {/* <div>
                                                                        <Icon className='cardIcon'>share</Icon>
                                                                  </div>  */}
                              
                                                            </div>
                                                      
                                                            <div>
                                                                  {
                                                                        chain == "MaticMumbai" ?

                                                                        _executed ? <div /> :
                                                                        _numConfirmations < confirmReq  ?
                                                                        <Button
                                                                              onClick={() => ConfirmTxn(txIndex, _typeOfTx)}
                                                                              variant="contained"
                                                                              color="primary"
                                                                              disabled={currentLoaderState}
                                                                              size={'large'}
                                                                              >
                                                                              Confirm
                                                                        </Button> :
                                                                        <Button
                                                                              onClick={() => executeTxn(txIndex, _typeOfTx)}
                                                                              variant="contained"
                                                                              color="primary"

                                                                              disabled={currentLoaderState}
                                                                              size={'large'}
                                                                              >
                                                                              Execute
                                                                        </Button>  :

                                                                        _numConfirmations < noOfConfirmReq ?
                                                                                                                                          
                                                                        <Button
                                                                              onClick={() => ConfirmTxn(txIndex, _typeOfTx)}
                                                                              variant="contained"
                                                                              color="primary"

                                                                              // disabled={!disableConfirm}
                                                                              size={'large'}
                                                                              >
                                                                              Confirm
                                                                        </Button> :
                                                                        !_executed ?
                                                                        <Button
                                                                              onClick={() => executeTxn(txIndex, _typeOfTx)}
                                                                              variant="contained"
                                                                              color="primary"

                                                                              // disabled={!disableConfirm}
                                                                              size={'large'}
                                                                              >
                                                                              Execute
                                                                        </Button> : <div /> 
                                                                  }
                                                            </div>
                              
                                                      </div>  
                                                      <div className="grid-item flex1">
                                                            <div className='flex m-b-10'>
                                                                  <Textfield 
                                                                        text={'Transaction ID:'}
                                                                        color={'#777'}
                                                                        fontSize={'15px'}
                                                                        className={'flex1'}
                                                                  />
                                                                  <div className='flex flex4'style={{alignItems: 'flex-start'}}>
                                                                        <Textfield 
                                                                              text={txIndex}
                                                                              color={'#000'}
                                                                              fontSize={'14px'}
                                                                              className={'m-r-10'}
                                                                        />
                                                                        {/* <Icon className='m-r-5 cardIcon'>content_copy</Icon> */}
                                                                  </div>
                                                            </div>
                                                            <div className='flex m-b-10'>
                                                                  <Textfield 
                                                                        text={'Created:'}
                                                                        color={'#777'}
                                                                        fontSize={'15px'}
                                                                        className={'flex1'}
                                                                  />
                                                                  <Textfield 
                                                                        text={timeAgo(_createdTime) + ` (${getDate(_createdTime)} +UTC)`}
                                                                        color={'#000'}
                                                                        fontSize={'14px'}
                                                                        className={'flex4'}
                                                                  />
                                                            </div>
                                                            <div className='flex' style={{ marginBottom: '20px'}}>
                                                                  <Textfield 
                                                                        text={'Executed:'}
                                                                        color={'#777'}
                                                                        fontSize={'15px'}
                                                                        className={'flex1'}
                                                                  />
                                                                  {
                                                                        _executed && 
                                                                        <Textfield 
                                                                              text={timeAgo(confirmData[confirmData?.length - 1].timestamp) + ` (${getDate(confirmData[confirmData?.length - 1].timestamp)} +UTC)`}
                                                                              color={'#000'}
                                                                              fontSize={'14px'}
                                                                              className={'flex4'}
                                                                        />
                                                                  }
                                                            
                                                            </div>
                                                            <div style={{paddingBottom: '15px', fontSize: '16px'}}>
                                                                  <a 
                                                                        target="_blank"
                                                                        href={ chain == "MaticMumbai" ?`${etherscanUrl}/tx/${hash[hash.length - 1]}` : 'https://nile.tronscan.org/#/'}>
                                                                              View on explorer
                                                                  </a>

                                                            </div>
                                                            
                                                      </div>
                                                </div>
                                                <div className="grid-item " style={{flex: 2}}>
                                                      <Steps
                                                            chain={chain}
                                                            activeStep={activeStepHandler(_numConfirmations, _executed)}
                                                            stepState={_executed}
                                                            stepData={{hash, from, _createdTime, _executed ,_numConfirmations, confirmData}}
                                                      />
                                                </div>
                                                
                                          </div>

                                    </AccordionDetails>
                              </Accordion>
                        )
                  })
            }
      </div>
     
  )
}

export default ConfirmationStep