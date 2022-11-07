import {useState, useEffect} from 'react'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { makeStyles, Typography, createStyles, Theme } from '@material-ui/core';
import _moment from "moment"
import {useNetwork} from "wagmi"

import { truncateMiddle } from '../utils';
import useCore from '../hooks/useCore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
  }),
);

function getSteps() {
      return ['Creation', 'Confirmations', 'Execution'];
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

function getStepContent(step: number, stepData: any, core: any, chainName, chain) {

      const {submitHash, submitFrom, submitTime, executed ,numConfirmations, confirmData} = stepData;
      
      const {config, _activeNetwork} = core

      let etherscanUrl = config[chainName?.id || _activeNetwork].etherscanUrl

      switch (step) {
        case 0:
          return (
            <div style={{padding: '10px 0'}}>
                  Created by&nbsp;
                  <a 
                        target="_blank"
                        href={chain == "Goerli" ? `${etherscanUrl}/tx/${submitHash}` : `https://nile.tronscan.org/#/transaction/${submitHash}`}>
                              {truncateMiddle(submitFrom, 12, "...")}
                  </a>&nbsp;
                   on {getDate(submitTime)}&nbsp;+UTC
            </div>
          );
        case 1:
            if( numConfirmations > 0 ) return (
                  <div style={{padding: '10px 0'}}>
                        Confirmed by&nbsp;
                        <a 
                              target="_blank"
                              href={chain == "Goerli" ? `${etherscanUrl}/tx/${submitHash}` : `https://nile.tronscan.org/#/transaction/${submitHash}`}>
                                    {truncateMiddle(submitFrom, 12, "...")}
                        </a>&nbsp; and&nbsp;
                        {
                              confirmData?.map((data, i) => 
                                    <span key={i}><a key={i} target="_blank" href={chain == "Goerli" ?  `${etherscanUrl}/tx/${data.hash}` : `https://nile.tronscan.org/#/transaction/${data.hash}`}>{truncateMiddle(data.from, 12, "...")}</a></span>
                              )
                        }
                        &nbsp;on {getDate(submitTime)}&nbsp;+UTC 
                        {
                              confirmData && <div>and&nbsp; 
                              {
                                    confirmData?.map((data) => getDate(data.timeStamp))
                              }&nbsp;+UTC&nbsp;respectively.</div>
                        }
                        
                        
                  </div>
            )
          return <div />
        case 2:
          return (
            <div style={{padding: '10px 0'}}>
                  {
                        (executed && confirmData) && 
                        <div>
                              Executed by&nbsp; 
                              <a 
                                    target="_blank" 
                                    href={chain == "Goerli" ? `${etherscanUrl}/tx/${confirmData[confirmData?.length - 1]}` : `https://nile.tronscan.org/#/transaction/${confirmData[confirmData?.length - 1]}`}>
                                          {truncateMiddle(confirmData[confirmData?.length - 1].from, 12, "...")} 
                              </a>&nbsp;
                              on {getDate(confirmData[confirmData?.length - 1].timeStamp)}&nbsp;+UTC
                        </div>
                  }
                 
            </div>
          );
        default:
          return 'Unknown step';
      }

}


function Steps(props: any) {
      const classes = useStyles();
      const core = useCore()
      const { chain: chainName} = useNetwork()

      const {stepState, activeStep,  chain, stepData} = props
      const [stepLabelColor, setStepLabelColor] = useState('#999');
      
      const steps = getSteps();

      useEffect(() => {
            if(stepState == 'successful') setStepLabelColor('#369e94')
            if(stepState == 'inProgress') setStepLabelColor('#ed7117')

      }, [stepState])

  return (
      <div className={classes.root}>
            <Stepper activeStep={activeStep} orientation="vertical">
                  {
                        steps.map((step: any, i: number) => (
                              <Step active={true} key={step}>
                                    <StepLabel style={{color: 'green'}}>{step}</StepLabel>
                                    <StepContent style={{paddingLeft: '20px'}}>
                                          <div>
                                                {
                                                      getStepContent(i, stepData, core, chainName, chain)
                                                }
                                          </div>
                                    </StepContent>
                              </Step>
                        ))
                  }
            </Stepper>
      </div>
      
  )
}

export default Steps