import { requestJira } from '@forge/bridge';
import { PER } from './helpers';

const getListIssueByJQL = ({ prjId, issuesId, userId, per = PER }) => {
  let projectField, issuesField, userField;

  if (prjId) projectField = `project = "${prjId}"`;
  if (issuesId) issuesField = `issue = "${issuesId}"`;
  if (userId) userField = `assignee = ${userId}`;

  const jql = [projectField, issuesField, userField]
    .filter(field => field)
    .join(' AND ')
    .concat(' ORDER BY created ASC ');

  return requestJira(`/rest/api/3/search?jql=${jql}&maxResults=${per}`);
};

const getUsersInProject = (key) => {
  return requestJira(`/rest/api/3/user/assignable/multiProjectSearch?projectKeys=${key}`);
};

const putEstimate = ({ payload, issueId }) => {
  return requestJira(`/rest/api/3/issue/${issueId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export default { getListIssueByJQL, getUsersInProject, putEstimate };