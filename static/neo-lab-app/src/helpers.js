import React from 'react';
import Avatar from '@atlaskit/avatar';
import Lozenge from '@atlaskit/lozenge';
import { router } from '@forge/bridge';
import moment from 'moment';

export const PER = 50;
const HOURS_OF_WORK = 8;

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
        color: '#aaa',
        fontWeight: 'bold',
        fontSize: '12px',
        fontFamily: 'Roboto',
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
    bar_start_data: fields.created,
    summary: <EllipsisText>{fields.summary}</EllipsisText>,
    estimated: getJiraEstTimeFormat(fields.aggregateprogress?.total),
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
    }
    ;

    return convertIssue(issue);
  });
};

const getWorkDays = (time) => time / 60 / 60 / HOURS_OF_WORK;

const getJiraEstTimeFormat = (time) => {
  time = Number(time);
  const w = Math.floor(time / (60 * 60 * 8 * 5));
  const d = Math.floor(time % (60 * 60 * 8 * 5) / (60 * 60 * 8));
  const h = Math.floor(time % (60 * 60 * 8) / (60 * 60));
  const m = Math.floor(time / 60 % 60);

  const wDisplay = w > 0 ? w + 'w ' : '';
  const dDisplay = d > 0 ? d + 'd ' : '';
  const hDisplay = h > 0 ? h + 'h ' : '';
  const mDisplay = m > 0 ? m + 'm' : '';

  return wDisplay + dDisplay + hDisplay + mDisplay;
};

export const formatTask = (task, cellWidth) => {
  const { bar_start_data, duration } = task;
  const hour = moment(bar_start_data).hour();

  if (hour > 17) {
    return { ...task, $w: duration * cellWidth, $x: task.$x + cellWidth };
  }

  const exactPosition = ((hour >= 9 ? hour : 9) - 9) / HOURS_OF_WORK;
  const barLeftPosition = task.$x + exactPosition * cellWidth;
  return { ...task, $w: duration * cellWidth, $x: barLeftPosition };
};