import React, { useEffect } from 'react'
import Icon from "@material-ui/core/Icon"
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import _moment from "moment"
import {
      TextField,
      Typography,
      Card,
      CardContent,
      Button,
      Grid,
      MenuItem
    } from "@material-ui/core";

import Steps from './Steps'
import Textfield from './Textfield';
import { truncateMiddle } from '../utils';
import { tronWeb } from '../views/dashboard/TestTron';
import { formatToBN, getBalance, getDisplayBalance } from '../utils/formatBalance';
import useGetOwners from '../hooks/useGetOwners';
import useCore from '../hooks/useCore';
import useConfirmTxn from '../hooks/useConfirmTxn';
import { BigNumber } from 'ethers';
import useGetConfirmReq from '../hooks/useGetConfirmReq';
import useExecuteTxn from '../hooks/useExecuteTxn';

function ConfirmationStep({allTx}) {
      const core = useCore()
      const {provider, signer, myAccount } = core

      const [index, setIndex] = React.useState('')

      useEffect(() => {
            // confirmTxnAction(0);
      }, []);
      
      // const testingMultiSig = async() => {
      //       const multiSigContractAdrs = "TJvdvGSTw3zrGwn4K7z6TmtSFga7UiAQcY"
      //       let contract = await tronWeb.contract().at(multiSigContractAdrs)
      //       console.log('ConfirmationStep contract', contract)
      // }

      // testingMultiSig()

      let testOwners: any = useGetOwners()
      let confirmReq = useGetConfirmReq()

      const disableConfirm = testOwners?.includes(myAccount)

      const confirmTxnAction = useConfirmTxn()


      const ConfirmTxn = (txIndex: number) => {

            confirmTxnAction(txIndex)
      }

      const getDate = (val: BigNumber) => {
            let timestamp = val.toNumber()
            console.log('timestamp', timestamp)
            let date = _moment.unix(timestamp).format("MMMM Do YYYY, h:mm:ss a");

            if(timestamp == 0) return 'N/A'
            return `${date}`
      }

      const timeAgo = (val: BigNumber) => {
            let timestamp = val.toNumber()  
            let date = _moment.unix(timestamp).fromNow();

            return date
      }

      const executeTxAction = useExecuteTxn(formatToBN(index))

      const executeTxn = (txIndex: number) => {
            setIndex(`${txIndex}`)
            executeTxAction(() => {
                        console.log('executeTxAction')
                  },
                  () => {
                        console.log('executeTxAction failed')
                  }
            )
      }
      
 
  return (
      <div>
            {
                  allTx.map((txn, i) => {
                        return(
                              <div key={i} id={'confirmDiv'} style={{marginBottom: '16px'}}>
                                    <div className='grid-item header'>
                                          <Textfield 
                                                text={`${txn._numConfirmations.toNumber() < confirmReq ? '2' : '3'}`}
                                                color={'#333'}
                                                fontSize={'16px'}
                                          />
                                          <Textfield 
                                                text={`${txn._typeOfTx.toNumber() == '0' ? 'Mint' : 'Burn'}`}
                                                color={'#333'}
                                                fontSize={'16px'}
                                          />
                                    <Textfield 
                                                text={`${timeAgo(txn._createdTime)}`}
                                                color={'#333'}
                                                fontSize={'16px'}
                                          />
                                          <div className='row-left-center'>
                                                <div><Icon className='m-r-5 headerIcon'>supervisor_account</Icon> </div>
                                                <Textfield 
                                                      text={`${txn._numConfirmations.toNumber()} out of ${confirmReq}`}
                                                      color={'#aaa'}
                                                      fontSize={'14px'}
                                                      fontWeight={'bold'}
                                                />
                                          </div>
                                          <div className='row-left-center'>
                                                <Textfield 
                                                      text={`${txn._numConfirmations.toNumber() < confirmReq ? 'Needs Confirmation' : !txn._executed ? 'Needs Execution' : 'Success'}`}
                                                      color={'#ed7117'}
                                                      fontSize={'14px'}
                                                      fontWeight={'bold'}
                                                />
                                                <div>&nbsp; &nbsp; <KeyboardArrowUpIcon /> </div>
                                          </div>
                                    </div>
                                    <div className='flex'>
                                          <div style={{flex: 3, display: 'flex', flexDirection: 'column'}}>
                                                <div className="grid-item flex1">
                                                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                      <Textfield 
                                                            text={`Mint ${getDisplayBalance(txn._value)} token(${ truncateMiddle(txn._token, 12, '...')}) to ${txn._to}`}
                                                            color={'#000'}
                                                            fontSize={'15px'}
                                                            className={'m-b-15'}
                                                            fontWeight={'bold'}
                                                      />
                        
                                                            <div>
                                                                  <Icon className='cardIcon'>share</Icon>
                                                            </div> 
                        
                                                      </div>
                                                      <div>
                                                            {
                                                                  txn._numConfirmations.toNumber() < confirmReq ?
                                                                  
                                                                  <Button
                                                                        onClick={() => ConfirmTxn(i)}
                                                                        variant="contained"
                                                                        color="primary"

                                                                        disabled={!disableConfirm}
                                                                        size={'large'}
                                                                        >
                                                                        Confirm
                                                                  </Button> :
                                                                  !txn._executed ?
                                                                  <Button
                                                                        onClick={() => executeTxn(i)}
                                                                        variant="contained"
                                                                        color="primary"

                                                                        disabled={!disableConfirm}
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
                                                                        text={i}
                                                                        color={'#000'}
                                                                        fontSize={'14px'}
                                                                        className={'m-r-10'}
                                                                  />
                                                                  <Icon className='m-r-5 cardIcon'>content_copy</Icon>
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
                                                                  text={getDate(txn._createdTime)}
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
                                                                  text={getDate(txn._executedTime)}
                                                                  color={'#000'}
                                                                  fontSize={'14px'}
                                                                  className={'flex4'}
                                                            />
                                                      </div>
                                                </div>
                                          </div>
                                          <div className="grid-item " style={{flex: 1}}>
                                                <Steps
                                                      activeStep={txn._numConfirmations.toNumber() != confirmReq ? 1 : !txn._executed ? 2 : 3}
                                                      stepState={'successful'}
                                                />
                                          </div>
                                          
                                    </div>
                              
                               </div>
                        )
                  })
            }
      </div>
     
  )
}

export default ConfirmationStep