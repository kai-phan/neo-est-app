import React from 'react';
import Select from '@atlaskit/select';
import Styled from 'styled-components';
import Avatar from '@atlaskit/avatar';

const AppSelect = ({ data,...rest }) => {
  const options = data.map((user, i) => {
    return {
      label: user.displayName,
      value: user.accountId,
      avatar: user.avatarUrls['24x24'],
    };
  });

  const CustomLabel = ({ src, text }) => {
    return (
      <StyleOption>
        <Avatar src={src}/> <span>{text}</span>
      </StyleOption>
    );
  };

  return (
    <StyleSelect
      isClearable
      placeholder="Select assignee"
      options={options}
      formatOptionLabel={(opt) => (
        <CustomLabel src={opt.avatar} text={opt.label}/>
      )}
      {...rest}
    />
  );
};

const StyleSelect = Styled(Select)`
    z-index: 1000;
`;

const StyleOption = Styled.div`
    display: flex;
    align-items: center;
    
    > span {
        padding-left: 8px;
    }
`;

export default AppSelect;