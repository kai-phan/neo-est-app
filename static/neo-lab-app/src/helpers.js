import React from 'react';
import Avatar from '@atlaskit/avatar';
import Lozenge from '@atlaskit/lozenge';
import { router } from '@forge/bridge';

export const PER = 50;

const Assignee = ({ issue }) => {
  const avatar = issue.fields.assignee?.avatarUrls['24x24'];
  const displayName = issue.fields.assignee?.displayName;

  return <Avatar src={avatar} name={displayName}/>;
};

const Status = ({ issue }) => {
  const status = issue.fields.status.name;

  if (status === 'To Do') {
    return <Lozenge appearance="default" isBold>{status.toUpperCase()}</Lozenge>;
  }
  if (status === 'Done') {
    return <Lozenge appearance="success" isBold>{status.toUpperCase()}</Lozenge>;
  }
  return <Lozenge appearance="inprogress" isBold>{status.toUpperCase()}</Lozenge>;
};

const EllipsisText = (props) => {
  return (
    <div
      style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {props.children}
    </div>
  );
};

const Link = (props) => {
  const onClick = async (e) => {
    e.preventDefault();
    await router.navigate(`/browse/${props.children}`);
  };

  return (
    <a
      onClick={onClick}
      style={{
        cursor: 'pointer',
        color: 'ccc',
      }}
    >
      {props.children}
    </a>
  );
};

export const convertIssue = (issue) => {
  const fields = issue.fields;
  return {
    id: issue.id,
    text: <Link>{issue.key}</Link>,
    key: issue.key,
    start_date: fields.created,
    summary: <EllipsisText>{fields.summary}</EllipsisText>,
    duration: getWorkDays(fields.aggregateprogress?.total || 0), // aggregatetimeoriginalestimate, timeestimate, timeoriginalestimate,aggregatetimespent,aggregatetimeestimate
    progress: fields.aggregateprogress?.percent || 0,
    assignee: fields.assignee?.accountId,
    avatar: fields.assignee?.avatarUrls['24x24'],
    displayName: fields.assignee?.displayName,
    renderAssignee: <Assignee issue={issue}/>,
    renderStatus: <Status issue={issue}/>,
    type: 'project',
  };
};

export const issuesToData = (issues) => {
  return issues.map((issue) => {
    const isSubtask = issue.fields.issuetype.subtask;

    if (isSubtask) {
      const hasParent = issues.some((item) => issue.fields.parent.id === item.id);
      return {
        ...convertIssue(issue),
        parent: hasParent ? issue.fields.parent.id : undefined,
        type: hasParent ? 'task' : 'project',
      };
    };

    return convertIssue(issue);
  });
};

const getWorkDays = (time) => time / 60 / 60 / 8;