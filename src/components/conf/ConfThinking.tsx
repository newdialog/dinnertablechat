import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import useInterval from '@use-it/interval';

const Transition = React.forwardRef(function Transition2(props:any, ref:any) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
    onClose?:()=>void;
}

export default function ConfThinking(props:Props) {
  const [open, setOpen] = React.useState(true);

  var close = () => {
    if(props.onClose) props.onClose();
    handleClose();
  }

  useInterval( ()=> {
    close();
  }, 5000);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition as any}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Please wait<br/><span style={{fontSize:'.75em'}}>maximizing group diversity...</span></DialogTitle>
        <DialogContent style={{textAlign:'center'}}>
            <img src="/conf/Blocks-1s-200px.svg" alt="loading spinned"/>
          <DialogContentText id="alert-dialog-slide-description">
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={close}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}