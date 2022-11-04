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
import { useGetActiveBlockChain, useGetActiveChainId } from '../state/chains/hooks';
import { useGetLoader, useUpdateLoader } from '../state/application/hooks';
import { useGetRequiredCount, useGetSingleTransaction, useGetOwners, useGetConfirmationCount, useGetTxnFromHash } from '../hooks/multisig/useMultiSig';
import useGetTokenDetails from '../hooks/useGetTokenDetails';
import ProgressModal from './ProgressModal';
import { useGetTronConfirmationCount, useGetTronTokenDetails, useTronGetIsExecuted } from '../hooks/tron/useTronMultisig';


function ConfirmationStep({allTransactions}) {
      const core = useCore()

      const {myAccount, provider, config, _activeNetwork, contracts } = core
      const { chain: chainName} = useNetwork()
      const chain = useGetActiveBlockChain()
      const updateLoader = useUpdateLoader()
      const currentLoaderState = useGetLoader()
      const {fetch} = useGetTokenDetails();
      const fetchTronTokenDetails = useGetTronTokenDetails()

      const [finalData, setFinalData] = useState<any[]>([])
      const [finalTronData, setFinalTronData] = useState<any[]>([])

      // Goerli network
      let testOwners: any = useGetOwners()
      let confirmReq = useGetRequiredCount()
      const disableConfirm = testOwners?.includes(myAccount)
      const confirmTxnAction = useConfirmTxn()
      const executeTxAction = useExecuteTxn()
      const setIsExecuted = useGetSingleTransaction()
      const getTxnFromHash = useGetTxnFromHash()
      const setConfirmationCount = useGetConfirmationCount()
      let etherscanUrl = config[chainName?.id || _activeNetwork].etherscanUrl
      // const chaindId = useGetActiveChainId()
            
      // Nile network
      let noOfConfirmReq = useNoOfConfimReq()
      const confirmTronTxnAction = useConfirm()
      const executeTronTxnAction = useExecute()
      const setTronIsExecuted = useTronGetIsExecuted()
      const setTronConfirmationCount = useGetTronConfirmationCount()

      useEffect(() => {
            getFinalData()
      }, [allTransactions, chain])


      const ConfirmTxn = (txIndex: number, _typeOfTx: string) => {

            updateLoader(true)

            if(chain != "Goerli"){
                  confirmTronTxnAction(txIndex)  
            }else{
                  confirmTxnAction(txIndex, _typeOfTx)
            }

      }

      const executeTxn = (txIndex: number, _typeOfTx: string) => {
            updateLoader(true)

            if(chain != "Goerli"){
                  executeTronTxnAction(txIndex)  
            }else{
                  executeTxAction(txIndex, _typeOfTx)
            }

      }

      const getDate = (val: number) => {
            let timestamp
            if(val.toString().length > 10){
                  timestamp = val/1000
            }else {
                  timestamp = val
            }
            let date = _moment.unix(timestamp).utc().format("MMM Do YYYY h:mm:ss a");
            if(timestamp == 0) return 'N/A'
            return `${date}`
      }

      const timeAgo = (val: number) => {
            let timestamp
            if(val.toString().length > 10){
                  timestamp = val/1000
            }else {
                  timestamp = val 
            }
            let date = _moment.unix(timestamp).fromNow();
            return date
      }

      const activeStepHandler = (confirmCount, isExecuted) => {

            if(chain == "Goerli"){
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

      const getFinalData = () => {
            let token, value, symbol, toAdrs

            if(chain == "Goerli"){
                  _.uniqWith(allTransactions).map(async(item: any, i: number) => {
                        const executed = await setIsExecuted(Number(item.index))
                        let numConfirmations = await setConfirmationCount(Number(item.index))
                        token = item.submitResponse.input.slice(10, 74)
                        token =  `0x${token.slice(24, token.length)}`
                        let tokenDetails = await fetch(token)
                        symbol = tokenDetails?.value.symbol
                        value = item.submitResponse.input.slice(338, 402) 
                        value = ethers.utils.formatEther(`0x${value}`)
                        toAdrs = item.submitResponse.input.slice(274, 338)
                        toAdrs = `0x${toAdrs.slice(24, toAdrs.length)}`
      
                        setFinalData(prev => {
      
                              if(prev.length) {
                                    const newState = prev.map((txns) => {
                    
                                          if(txns.index == item.index){
                                            return {...item, token, symbol, value, executed, numConfirmations, toAdrs}
                                          }
                                          return txns
                                        })
                                    return newState;
                              }else{
                                    return [...prev, item]
                              }
                            })
                  })
            }else {
                  let arr1: any[] = []

                  _.uniqWith(allTransactions).map(async(item: any, i: number) => {
                        
                        const executed = await setTronIsExecuted(item.index)
                        let numConfirmations = await setTronConfirmationCount(Number(item.index))
                        token = item.submitResponse.input.slice(8, 72)
                        token =  `${token.slice(24, token.length)}`
                        let tokenDetails = await fetchTronTokenDetails(`41${token}`)
                        symbol = tokenDetails?.symbol
                        toAdrs = item.submitResponse.input.slice(272, 336)
                        toAdrs = `${toAdrs.slice(24, toAdrs.length)}`

                        value = item.submitResponse.input.slice(336, 400) 
                        value = ethers.utils.formatEther(`0x${value}`)

                        // arr1.push({...item, token, symbol, value, executed, numConfirmations, toAdrs})
                              
                        setFinalTronData(prev => [...prev, {...item, token, symbol, value, executed, numConfirmations, toAdrs}])
                  })

                  
            }

            
      }

      console.log("ConfirmationStep", finalData, finalTronData)

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
            {/* <button onClick={() => ConfirmTxn(1, "mint")}>confirm</button> */}
            {
                   _.uniqWith(chain == "Goerli" ? finalData : finalTronData, (arrVal, othVal) => arrVal.index == othVal.index)?.sort((a, b) => b.index - a.index).map((item: any, i) => {
                        const {submitResponse, toAdrs: submitTo, index, token, symbol, value, confirmData, typeOfTxn, executed, numConfirmations} = item
                        const {from: submitFrom, hash: submitHash, timeStamp: submitTime } = submitResponse
                        
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
                                                            text={index}
                                                            color={'#333'}
                                                            fontSize={'16px'}    
                                                      />
                                                </div>
                                                <div>
                                                      <Textfield 
                                                            text={`${typeOfTxn} (${value} ${symbol})`}
                                                            color={'#333'}
                                                            fontSize={'16px'}
                                                      />
                                                </div>
                                                <div>
                                                      <Textfield 
                                                            text={`${timeAgo(submitTime)}`}
                                                            color={'#333'}
                                                            fontSize={'16px'}
                                                      />
                                                </div>
                                                <div className='row-left-center'>
                                                      <div><Icon className='m-r-5 headerIcon'>supervisor_account</Icon> </div>
                                                      <Textfield 
                                                            text={ executed ? `Fullfilled` : `${numConfirmations} out of ${confirmReq}`}
                                                            color={'#aaa'}
                                                            fontSize={'14px'}
                                                            fontWeight={'bold'}
                                                      />
                                                </div>
                                                <div style={{width: '180px'}} className={"row-allcenter"}>
                                                      <Textfield 
                                                            text={`${
                                                                  chain == 'Goerli' ? 
                                                                  executed ? "Success" : numConfirmations < confirmReq ? 'Needs Confirmation' : 'Needs Execution' :
                                                                  executed ? "Success" : numConfirmations < noOfConfirmReq ? 'Needs Confirmation' : 'Needs Execution'
                                                                  // numConfirmations < noOfConfirmReq ? 'Needs Confirmation' : !executed ? 'Needs Execution' : 'Success'
                                                            }`}
                                                            // color={'#ed7117'}
                                                            color={`${
                                                                  chain == 'Goerli' ? 
                                                                  // _numConfirmations < confirmReq ? '#FF4500' : !_executed ? '#FF4500' : '#228B22' :
                                                                  executed ? '#228B22' : numConfirmations < confirmReq ? '#FF4500' : "" :
                                                                  executed ? '#228B22' :  numConfirmations < noOfConfirmReq ? '#FF4500' : ""
                                                                  // numConfirmations < noOfConfirmReq ? '#FF4500' : !executed ? '#FF4500' : '#228B22'
                                                            }`}
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
                                                                  text={`${typeOfTxn} ${value} ${symbol} (${ truncateMiddle(chain == "Goerli" ? token : window.tronWeb.address.fromHex(`41${token}`), 12, '...')}) to ${ chain == "Goerli" ? submitTo : window.tronWeb.address.fromHex(`41${submitTo}`)}`}
                                                                  color={'#000'}
                                                                  fontSize={'15px'}
                                                                  className={'m-b-15'}
                                                                  fontWeight={'bold'}
                                                            />
                              
                                                                  {/* <div>
                                                                        <Icon className='cardIcon'>content_copy</Icon>
                                                                  </div>  */}
                              
                                                            </div>
                                                      
                                                            <div>
                                                                  {
                                                                        chain == "Goerli" ?

                                                                        executed ? <div /> :
                                                                        numConfirmations < confirmReq  ?
                                                                        <Button
                                                                              onClick={() => ConfirmTxn(index, typeOfTxn)}
                                                                              variant="contained"
                                                                              color="primary"
                                                                              disabled={currentLoaderState}
                                                                              size={'large'}
                                                                              >
                                                                              Confirm
                                                                        </Button> :
                                                                        <Button
                                                                              onClick={() => executeTxn(index, typeOfTxn)}
                                                                              variant="contained"
                                                                              color="primary"

                                                                              disabled={currentLoaderState}
                                                                              size={'large'}
                                                                              >
                                                                              Execute
                                                                        </Button>  :

                                                                        numConfirmations < noOfConfirmReq ?
                                                                                                                                          
                                                                        <Button
                                                                              onClick={() => ConfirmTxn(index, typeOfTxn)}
                                                                              variant="contained"
                                                                              color="primary"

                                                                              // disabled={!disableConfirm}
                                                                              size={'large'}
                                                                              >
                                                                              Confirm
                                                                        </Button> :
                                                                        !executed ?
                                                                        <Button
                                                                              onClick={() => executeTxn(index, typeOfTxn)}
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
                                                                              text={index}
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
                                                                        text={timeAgo(submitTime) + ` (${getDate(submitTime)} +UTC)`}
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
                                                                        (executed && numConfirmations > 0 && confirmData ) && 
                                                                        <Textfield 
                                                                              text={timeAgo(confirmData[confirmData?.length - 1].timeStamp) + ` (${getDate(confirmData[confirmData?.length - 1].timeStamp)} +UTC)`}
                                                                              color={'#000'}
                                                                              fontSize={'14px'}
                                                                              className={'flex4'}
                                                                        />
                                                                  }
                                                            
                                                            </div>
                                                            <div style={{paddingBottom: '15px', fontSize: '16px'}}>
                                                                  <a 
                                                                        target="_blank"
                                                                        href={ chain == "Goerli" ?`${etherscanUrl}/tx/${submitHash}` : `https://nile.tronscan.org/#/transaction/${submitHash}`}>
                                                                              View on explorer
                                                                  </a>

                                                            </div>
                                                            
                                                      </div>
                                                </div>
                                                <div className="grid-item " style={{flex: 2}}>
                                                      <Steps
                                                            chain={chain}
                                                            activeStep={activeStepHandler(numConfirmations, executed)}
                                                            stepState={executed}
                                                            stepData={{submitHash, submitFrom, submitTime, executed ,numConfirmations, confirmData}}
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