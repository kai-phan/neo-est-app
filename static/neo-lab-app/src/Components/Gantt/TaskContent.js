import React from 'react';
import Avatar from '@atlaskit/avatar';
import Styled from 'styled-components';

const TaskContent = (props) => {
  const { data } = props;

  return (
    <Wrapper className="avatar">
      <Avatar src={data.avatar} name={data.displayName}/>
    </Wrapper>
  );
};

const Wrapper = Styled.div`
  > div {
    display: block !important;
  }
`;

export default TaskContent;