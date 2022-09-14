import React, {useEffect} from 'react';
import styled from 'styled-components';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {TransitionProps} from '@material-ui/core/transitions';

// import theme from '../../theme';
// import '../../customCss/Custom-Snackbar.css';

import config from '../../config';
import {PopupContent} from '../../utils/interface';
import {useGetActiveChainId} from "../../state/chains/hooks";

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

  console.log('chainId', chainId)
  // console.log('test', config[chainId].etherscanUrl)

  useEffect(() => {
    setOpen(true)
  }, [isScucess, isLoading])

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;

    setOpen(false);
    if (handleCancel) handleCancel();
  };

  function SlideTransition(props: TransitionProps) {
    return <Slide {...props} direction="left"/>;
  }

  const SnackHeader = () => {
    if (isLoading) {
      return (
        <SnackBarInnerContainer>
          <div className="single-line-center-start">
            <div onClick={handleClose}>Pending Icon</div>
            Transaction Pending
          </div>
          <div onClick={handleClose}>Cross Icon</div>
        </SnackBarInnerContainer>
      )
    } else if (isScucess) {
      return (
        <SnackBarInnerContainer>
          <div className="single-line-center-start">
          <div onClick={handleClose}>Success Icon</div>
            Transaction Successful
          </div>
          <div onClick={handleClose}>Cross Icon</div>
        </SnackBarInnerContainer>
      )
    } else {
      return (
        <SnackBarInnerContainer>
          <div className="single-line-center-start">
          <div onClick={handleClose}>Alert Icon</div>
            Transaction Failed
          </div>
          <div onClick={handleClose}>Cross Icon</div>
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
              href={`${config[chainId].etherscanUrl}/tx/${content?.txn?.hash}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div>View on Explorer</div>
              <div onClick={handleClose}>ArrowLink Icon</div>

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
          autoHideDuration={3000}
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
`;

const SnackBarBody = styled.div`
  background: grey;
  backdrop-filter: blur(70px);
  border-radius: 0 0 4px 4px;
  padding: 12px 12px 12px 52px;
  font-weight: 600;
  font-size: 14px;
  width: 100%;
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
  opacity: 0.88;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export default CustomizedSnackbars;
