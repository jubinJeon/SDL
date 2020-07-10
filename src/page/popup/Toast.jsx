import React from 'react';
import { Snackbar } from '@material-ui/core';

export default function Toast(props) {

  const callback = ()=>{
    props.callback(props.data)
  }

  return (
    <div className="toastPop">
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={props.show}
        autoHideDuration={1000}
        disableWindowBlurListener={true}
        onClose= {callback}
        message={props.data.msg}
      />
    </div>
  );
}

