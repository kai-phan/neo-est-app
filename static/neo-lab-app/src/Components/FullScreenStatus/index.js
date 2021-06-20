import React from 'react';
import Spinner from '@atlaskit/spinner';
import Styled from 'styled-components';
import Search from '@atlaskit/icon/glyph/search';
import Error from '@atlaskit/icon/glyph/error';

const FullScreenStatus = (props) => {
  const { status } = props;

  return (
    <StyleWrapper>
      {status === 'loading' && <Spinner/>}
      {status === 'error' && (
        <div>
          <Error size="xlarge"/>
          <div>
            An error occur!
          </div>
        </div>
      )}
      {status === 'no-data' && (
        <div>
          <Search size="xlarge"/>
          <div>
            No data!
          </div>
        </div>
      )}
    </StyleWrapper>
  );
};

const StyleWrapper = Styled.div`
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    
    > div {
        text-align: center;
    }
`;

export default FullScreenStatus;
