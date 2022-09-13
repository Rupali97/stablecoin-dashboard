import React from 'react'
import Icon from "@material-ui/core/Icon"
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import Steps from './Steps'
import Textfield from './Textfield';
import { truncateMiddle } from '../utils';
import { tronWeb } from '../views/dashboard/TestTron';

function ConfirmationStep() {

      const testingMultiSig = async() => {
            const multiSigContractAdrs = "TJvdvGSTw3zrGwn4K7z6TmtSFga7UiAQcY"
            let contract = await tronWeb.contract().at(multiSigContractAdrs)
            console.log('ConfirmationStep contract', contract)
      }

     
      testingMultiSig()

  return (
      <div id={'confirmDiv'}>
            <div className='grid-item header'>
                  <Textfield 
                        text={'3'}
                        color={'#333'}
                        fontSize={'16px'}
                  />
                  <div className='row-left-center'>
                        <div className='m-r-5'><Icon className='flip180 headerIcon'>unfold_more</Icon> </div>
                        <Textfield 
                              text={'MahaDAO'}
                              color={'#333'}
                              fontSize={'16px'}
                        />
                  </div>
                  <Textfield 
                        text={'changeAdmin'}
                        color={'#333'}
                        fontSize={'16px'}
                  />
                 <Textfield 
                        text={'3 months ago'}
                        color={'#333'}
                        fontSize={'16px'}
                  />
                  <div className='row-left-center'>
                        <div><Icon className='m-r-5 headerIcon'>supervisor_account</Icon> </div>
                        <Textfield 
                              text={'1 out of 2'}
                              color={'#aaa'}
                              fontSize={'14px'}
                              fontWeight={'bold'}
                        />
                  </div>
                  <div className='row-left-center'>
                        <Textfield 
                              text={'Needs confirmation'}
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
                                    text={'Interact with:'}
                                    color={'#000'}
                                    fontSize={'15px'}
                                    className={'m-b-15'}
                                    fontWeight={'bold'}
                              />

                                    <div>
                                          <Icon className='cardIcon'>share</Icon>
                                    </div> 

                              </div>
                        
                              <div className='flex' style={{marginBottom: '25px'}}>
                                    <div className='m-r-5'>
                                          <Icon fontSize='large'>account_circle</Icon>
                                    </div>
                                    <div className='flex' style={{flexDirection: 'column'}}>
                                          <Textfield 
                                                text={'MahaDAO'}
                                                color={'#333'}
                                                fontSize={'15px'}
                                                className={'m-b-5'}
                                          />
                                          <div>
                                                <div className='flex'>
                                                      <Textfield 
                                                            text={'bnb: '}
                                                            color={'#000'}
                                                            fontSize={'14px'}
                                                            fontWeight={'bold'}
                                                      /> &nbsp; &nbsp;
                                                      <Textfield 
                                                            text={'0x4D3150f1D4B4Aef92BEB9a88f3DC2901C75BcCec'}
                                                            color={'#333'}
                                                            fontSize={'14px'}
                                                            className={'m-r-10'}
                                                      />
                                                      <Icon className='m-r-5 cardIcon'>content_copy</Icon>
                                                      <Icon className='m-r-5 cardIcon'>ios_share</Icon>
                                                      <Icon className='m-r-5 cardIcon'>more_horiz</Icon>
                                                </div>
                                               
                                          </div>
                                    </div>
                              </div>
                              <Textfield 
                                    text={'CHANGE ADMIN'}
                                    color={'#666'}
                                    fontSize={'12px'}
                                    className={'m-b-5'}
                                    fontWeight={'bold'}
                              />
                              <div className='flex'>
                                    <Textfield 
                                          text={'newAdmin(address):'}
                                          color={'#777'}
                                          fontSize={'15px'}
                                          className={'flex1'}
                                    />
                                     <div className='flex flex4'>
                                          <Textfield 
                                                text={'bnb: '}
                                                color={'#000'}
                                                fontSize={'14px'}
                                                fontWeight={'bold'}
                                          /> &nbsp;
                                          <Textfield 
                                                text={truncateMiddle('0x4D3150f1D4B4Aef92BEB9a88f3DC2901C75BcCec', 12, '...')}
                                                color={'#333'}
                                                fontSize={'14px'}
                                                className={'m-r-10'}
                                          />
                                          <Icon className='m-r-5 cardIcon'>content_copy</Icon>
                                          <Icon className='m-r-5 cardIcon'>ios_share</Icon>
                                    </div>
                              </div>

                        </div>  
                        <div className="grid-item flex1">
                              <div className='flex m-b-10'>
                                    <Textfield 
                                          text={'SafeTxHash:'}
                                          color={'#777'}
                                          fontSize={'15px'}
                                          className={'flex1'}
                                    />
                                     <div className='flex flex4'style={{alignItems: 'flex-start'}}>
                                          <Textfield 
                                                text={truncateMiddle('0x4D3150f1D4B4Aef92BEB9a88f3DC2901C75BcCec', 12, '...')}
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
                                          text={'May 21, 2022 - 12:07:00 PM'}
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
                                          text={'N/A'}
                                          color={'#000'}
                                          fontSize={'14px'}
                                          className={'flex4'}
                                    />
                              </div>
                              <div style={{color: '#369e94', textDecoration: 'underline'}}>Advanced Details</div>
                        </div>
                  </div>
                  <div className="grid-item " style={{flex: 1}}>
                        <Steps
                              stepState={'successful'}
                         />
                  </div>
                  
            </div>
            
      </div>
  )
}

export default ConfirmationStep