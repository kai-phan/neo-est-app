import { requestJira } from '@forge/bridge';

const getListIssue = () => {
    return requestJira('/rest/api/3/issue/createmeta');
}

export default { getListIssue };