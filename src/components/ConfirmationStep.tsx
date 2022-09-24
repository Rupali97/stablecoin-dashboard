import React, { useEffect } from 'react'
import Icon from "@material-ui/core/Icon"
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import _moment from "moment"
import {Button} from "@material-ui/core";
import clsx from 'clsx';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

import Steps from './Steps'
import Textfield from './Textfield';
import { truncateMiddle } from '../utils';
// import { tronWeb } from '../views/dashboard/TestTron';
import { formatToBN, getBalance, getDisplayBalance } from '../utils/formatBalance';
import useGetOwners from '../hooks/useGetOwners';
import useCore from '../hooks/useCore';
import useConfirmTxn from '../hooks/useConfirmTxn';
import { BigNumber } from 'ethers';
import useGetConfirmReq from '../hooks/useGetConfirmReq';
import useExecuteTxn from '../hooks/useExecuteTxn';
import useConfirm from '../hooks/tron/useConfirm';
import useExecute from '../hooks/tron/useExecute';
import useNoOfConfimReq from '../hooks/tron/useNoOfConfimReq';
import { useGetActiveBlockChain } from '../state/chains/hooks';

function ConfirmationStep({allTx}) {
      const core = useCore()
      const {myAccount } = core
      const chain = useGetActiveBlockChain()

      // maticMumbai network
      let testOwners: any = useGetOwners()
      let confirmReq = useGetConfirmReq()
      const disableConfirm = testOwners?.includes(myAccount)
      const confirmTxnAction = useConfirmTxn()
      const executeTxAction = useExecuteTxn()


      // Nile network
      let noOfConfirmReq = useNoOfConfimReq()
      const confirmTronTxnAction = useConfirm()
      const executeTronTxnAction = useExecute()

      const ConfirmTxn = (txIndex: number, _typeOfTx: number) => {

            if(chain != "MaticMumbai"){
                  confirmTronTxnAction(txIndex)  
            }else{
                  confirmTxnAction(txIndex, _typeOfTx)
            }

      }

      const executeTxn = (txIndex: number, _typeOfTx: number) => {

            if(chain != "MaticMumbai"){
                  executeTronTxnAction(txIndex)  
            }else{
                  executeTxAction(txIndex, _typeOfTx)
            }

      }

      const getDate = (val: number) => {
            let timestamp = val
            let date = _moment.unix(timestamp).format("MMMM Do YYYY, h:mm:ss a");
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

  return (
      <div>
            <Textfield
                  text={'Transactions'}
                  fontSize={'24px'}
                  fontWeight={'bold'}
                  className={'m-b-15'}
            />
            {
                  allTx?.sort((a, b) => b.txIndex - a.txIndex ).map(({hash,txDetail}, i) => {
                        const { _numConfirmations, _typeOfTx, _createdTime, _executed, _value, _token, txIndex, _executedTime, _to} = txDetail
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
                                                            text={`${_typeOfTx == 0 ? 'Mint' : 'Burn'}`}
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
                                                            text={`${_numConfirmations} out of ${chain == 'MaticMumbai' ? confirmReq : noOfConfirmReq}`}
                                                            color={'#aaa'}
                                                            fontSize={'14px'}
                                                            fontWeight={'bold'}
                                                      />
                                                </div>
                                                <div style={{width: '180px'}} className={"row-allcenter"}>
                                                      <Textfield 
                                                            text={`${
                                                                  chain == 'MaticMumbai' ? 
                                                                  _numConfirmations < confirmReq ? 'Needs Confirmation' : !_executed ? 'Needs Execution' : 'Success' :
                                                                  _numConfirmations < noOfConfirmReq ? 'Needs Confirmation' : !_executed ? 'Needs Execution' : 'Success'}`}
                                                            // color={'#ed7117'}
                                                            color={`${
                                                                  chain == 'MaticMumbai' ? 
                                                                  _numConfirmations < confirmReq ? '#FF4500' : !_executed ? '#FF4500' : '#228B22' :
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
                                                            text={`${_typeOfTx == 0 ? 'Mint' : 'Burn'} ${getDisplayBalance(_value)} token(${ truncateMiddle(_token, 12, '...')}) to ${_to}`}
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

                                                                  _numConfirmations < confirmReq ?
                                                                  
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
                                                                  </Button> : <div /> :

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
                                                                  text={getDate(_createdTime)}
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
                                                            <Textfield 
                                                                  text={getDate(_executedTime)}
                                                                  color={'#000'}
                                                                  fontSize={'14px'}
                                                                  className={'flex4'}
                                                            />
                                                      </div>
                                                      <div style={{paddingBottom: '15px', fontSize: '16px'}}>
                                                            <a 
                                                                  target="_blank"
                                                                  href={ chain == "MaticMumbai" ?`https://mumbai.polygonscan.com/tx/${hash}` : 'https://nile.tronscan.org/#/'}>
                                                                        View on explorer
                                                            </a>

                                                      </div>
                                                      
                                                </div>
                                          </div>
                                          <div className="grid-item " style={{flex: 1}}>
                                                <Steps
                                                      chain={chain}
                                                      activeStep={activeStepHandler(_numConfirmations, _executed)}
                                                      stepState={_executed}
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