import React from 'react';
import Textfield from '@atlaskit/textfield';

const AppTextField = (props) => {

  return (
    <Textfield
      placeholder="Issue ID"
      onChange={(e) => props.onChange(e.target.value)}
      {...props}
    />
  );
};

export default AppTextField;