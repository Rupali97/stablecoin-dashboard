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
      let timestamp = val
      let date = _moment.unix(timestamp).utc().format("MM-D-YYYY h:mm:ss a");
      if(timestamp == 0) return 'N/A'
      return `${date}`
}

function getStepContent(step: number, stepData: any, core: any, chainName) {

      const {from, _createdTime, _executed, hash, _numConfirmations, confirmData} = stepData;
      console.log("getStepContent confirmData", confirmData)
      const {config, _activeNetwork} = core

      let etherscanUrl = config[chainName?.id || _activeNetwork].etherscanUrl

      switch (step) {
        case 0:
          return (
            <div style={{padding: '10px 0'}}>
                  Created by&nbsp;
                  <a 
                        target="_blank"
                        href={ `${etherscanUrl}/tx/${hash[0]}`}>
                              {truncateMiddle(from, 12, "...")}
                  </a>&nbsp;
                   on {getDate(_createdTime)}&nbsp;+UTC
            </div>
          );
        case 1:
            if( _numConfirmations > 1 ) return (
                  <div style={{padding: '10px 0'}}>
                        Confirmed by&nbsp;
                        {
                              hash?.map((data, i) => 
                                    <span key={i}><a key={i} target="_blank" href={ `${etherscanUrl}/tx/${data}`}>{truncateMiddle(data, 12, "...")}</a> {} and </span>
                              )
                        }
                        &nbsp;on {getDate(_createdTime)}&nbsp;+UTC and&nbsp;
                        {
                            confirmData?.map((data) => getDate(data.timestamp))
                        }&nbsp;+UTC
                        &nbsp;respectively.
                  </div>
            )
          return <div />
        case 2:
          return (
            <div style={{padding: '10px 0'}}>
                  {
                        _executed && 
                        <div>
                              Executed by&nbsp; 
                              <a 
                                    target="_blank" 
                                    href={ `${etherscanUrl}/tx/${hash[hash?.length - 1]}`}>
                                          {truncateMiddle(confirmData[confirmData?.length - 1].from, 12, "...")} 
                              </a>&nbsp;
                              on {getDate(confirmData[confirmData?.length - 1].timestamp)}&nbsp;+UTC
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
      console.log("stepData", stepData)
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
                                                      getStepContent(i, stepData, core, chainName)
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