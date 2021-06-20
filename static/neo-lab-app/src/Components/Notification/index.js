import React, { useState } from 'react';
import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';
import ErrorIcon from '@atlaskit/icon/glyph/error';

const AppFlag = ({ list }) => {
  const [flags, setFlags] = useState(list);

  const handleDismiss = () => {
    setFlags([]);
  };

  return (
    <FlagGroup onDismissed={handleDismiss}>
      {flags.map(flg => {
        return (
          <AutoDismissFlag icon={} title={} id={}/>
        )
      })}
    </FlagGroup>
  )
}
export default AppFlag;