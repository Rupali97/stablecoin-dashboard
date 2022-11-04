import React, {useEffect} from 'react';
import styled from 'styled-components';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {TransitionProps} from '@material-ui/core/transitions';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import CallMadeIcon from '@material-ui/icons/CallMade';
// import theme from '../../theme';
// import '../../customCss/Custom-Snackbar.css';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import config from '../../config';
import {PopupContent} from '../../utils/interface';
import {useGetActiveBlockChain, useGetActiveChainId} from "../../state/chains/hooks";
import { useUpdateLoader } from '../../state/application/hooks';

interface TxButtonProps {
  notificationCount?: number;
  index?: number;
  open?: boolean;
  content?: PopupContent;
  handleCancel?: Function;
}


const CustomizedSnackbars: React.FC<TxButtonProps> = ({
  open,
  content,
  handleCancel,
}) => {

  const [openSnackbar, setOpen] = React.useState(open);

  const isScucess = content?.txn?.success;
  const isLoading = content?.txn?.loading;
  const chainId = useGetActiveChainId();
  const updateLoader = useUpdateLoader()
  const chain = useGetActiveBlockChain()

  useEffect(() => {
    setOpen(true)
    console.log("loadertest CustomizedSnackbars")
    updateLoader(false)
  }, [isScucess, isLoading])

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    
    if (reason === 'clickaway') return;

    setOpen(false);
    if (handleCancel) handleCancel();

    // setTimeout(() => {
    //   window.location.reload()
    // }, 2000)
  };

  function SlideTransition(props: TransitionProps) {
    return <Slide {...props} direction="left"/>;
  }

  const SnackHeader = () => {
    if (isLoading) {
      return (
        <SnackBarInnerContainer>
          <div className="row-left-center">
            <div onClick={handleClose} className={'m-r-10'}><WarningIcon /></div>
            Transaction Pending
          </div>
          <div onClick={handleClose}> <CancelIcon /> </div>
        </SnackBarInnerContainer>
      )
    } else if (isScucess) {
      return (
        <SnackBarInnerContainer> 
          <div className="row-left-center">
            <div onClick={handleClose} className={'m-r-10'}><CheckCircleIcon /></div>
            <div>Transaction Successful</div>
          </div>
          <div onClick={handleClose}><CancelIcon /> </div>
        </SnackBarInnerContainer> 
      )
    } else {
      return (
        <SnackBarInnerContainer style={{background: '#B61500'}}>
          <div className="row-left-center">
          <div onClick={handleClose} className={'m-r-10'}><WarningIcon /></div>
            Transaction Failed
          </div>
          <div onClick={handleClose}><CancelIcon /></div>
        </SnackBarInnerContainer>
      )
    }
  }

  const SnackBody = () => {
    return (
      <SnackBarBody>
        <div>
          {
            content?.txn?.success || content?.txn?.loading
            ? content?.txn?.summary || ""
            : content?.error?.message || "Error Occured"
          }
        </div>
        { 
          config[chainId].etherscanUrl !== '' && content?.txn?.hash && (
            <AnchorTag
              href={chain == "Nile" ? `https://nile.tronscan.org/#/transaction/${content?.txn?.hash}`  :`${config[chainId].etherscanUrl}/tx/${content?.txn?.hash}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className={'m-r-5'}>View on Explorer</div>
              <div onClick={handleClose} style={{display: 'flex', alignItems: 'center'}}>
                <TrendingFlatIcon />
              </div>

            </AnchorTag>
          )
        }
      </SnackBarBody>
    )
  }

  return (
    <div>
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          TransitionComponent={SlideTransition}
          onClose={handleClose}
          anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        >
          <SnackBarParent>
            {SnackHeader()}
            {SnackBody()}
          </SnackBarParent>
        </Snackbar>
      )}
    </div>
  );
};

const AnchorTag = styled.a`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 4px;
  &:hover {
    text-decoration: none;
  }
`;

const SnackBarInnerContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 50px;
  padding: 0 12px 0 18px;
  justify-content: space-between;
  border-radius: 4px 4px 0 0;
  background: #3f046d;
  color: white;
`;

const SnackBarBody = styled.div`
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(70px);
  border-radius: 0 0 4px 4px;
  padding: 12px 12px 12px 52px;
  font-weight: 600;
  font-size: 14px;
  width: 100%;
  color: black;
`;

const SnackBarParent = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(70px);
  border-radius: 4px 4px 0 0;
  border: 1px solid;
  width: 378px;
  border-image-source: linear-gradient(180deg,
  rgba(255, 116, 38, 0.1) 0%,
  rgba(255, 255, 255, 0) 100%);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export default CustomizedSnackbars;
