import React, { useEffect, useState } from 'react';
import { invoke, view } from '@forge/bridge';
import Styled from 'styled-components';

import api from './api';
import FullScreenStatus from './Components/FullScreenStatus';
import AppGantt from './Components/Gantt';
import AppHeader from './Components/AppHeader';

export const EstimateCtx = React.createContext();

function App() {
  const [appStatus, setAppStatus] = useState(null);

  const [currentProject, setCurrentProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [issues, setIssues] = useState([]);

  const [isEst, setIsEst] = useState(false);

  useEffect(() => {
    if (!issues.length) {
      setAppStatus('no-data');
    } else {
      setAppStatus(null);
    }
  }, [issues]);

  useEffect(() => {
    const fetchResources = async () => {
      setAppStatus('loading');

      const context = await view.getContext();
      const { project } = context.extension;
      setCurrentProject(project);

      const allResponse = await Promise.all([
        api.getListIssueByJQL({ prjId: project.key }),
        api.getUsersInProject(project.key)
      ]);

      const hasError = allResponse.some(res => !res.ok);
      if (hasError) {
        setAppStatus('error');
        return;
      }

      const [issuesResponse, usersResponse] = allResponse;
      setIssues(issuesResponse.body.issues);
      setUsers(usersResponse.body);

      setAppStatus(null);
    };

    fetchResources();
  }, []);

  const headerProps = {
    users,
    currentProject,
    setIssues,
  };

  return (
    <EstimateCtx.Provider value={{ isEst, setIsEst }}>
      {currentProject && <AppHeader {...headerProps}/>}
      <MarginBottom value={16}/>
      {appStatus ? <FullScreenStatus status={appStatus}/> : (
        <React.Fragment>
          <AppGantt issues={issues}/>
        </React.Fragment>
      )}
    </EstimateCtx.Provider>
  );
}

const MarginBottom = Styled.div`
    margin-bottom: ${({ value }) => value || 0}px;
`;

export default App;
