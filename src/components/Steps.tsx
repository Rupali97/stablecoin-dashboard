import {useState, useEffect} from 'react'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import { Typography } from '@material-ui/core';

function getSteps() {
      return ['Created', 'Confirmations', 'Executed'];
}

function getStepContent(step: number) {
      switch (step) {
        case 0:
          return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                  <div>- &nbsp;Transaction created by Rupali Doke</div>
                  <div>- &nbsp;Confirmation is pending</div>
            </div>
          );
        case 1:
          return  (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                  <div>- &nbsp;Need confirmation from Steven Enamaked</div>
                  <div>- &nbsp;Need confirmation from Alan Johnson</div>
            </div>
          )
        case 2:
          return `Can be executed once the threshold is reached`;
        default:
          return 'Unknown step';
      }
}

function Steps(props: any) {
      const {stepState} = props
      const [activeStep, setActiveStep] = useState(0);
      const [stepLabelColor, setStepLabelColor] = useState('#999');
      
      const steps = getSteps();

      useEffect(() => {
            if(stepState == 'successful') setStepLabelColor('#369e94')
            if(stepState == 'inProgress') setStepLabelColor('#ed7117')

      }, [stepState])


      console.log('stepLabelColor', stepLabelColor)


  return (
      <Stepper activeStep={activeStep} orientation="vertical">
            {
                  steps.map((step: any, i: number) => (
                        <Step key={step}>
                              <StepLabel style={{color: 'green'}}>{step}</StepLabel>
                              <StepContent>
                                    <Typography>
                                          {
                                                getStepContent(i)
                                          }
                                    </Typography>
                              </StepContent>
                        </Step>
                  ))
            }
      </Stepper>
  )
}

export default Steps