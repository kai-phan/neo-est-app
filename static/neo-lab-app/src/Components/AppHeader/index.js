import React, { useContext, useEffect, useState } from 'react';
import Styled from 'styled-components';
import LoadingButton from '@atlaskit/button/loading-button';
import Form, { Field } from '@atlaskit/form';

import api from '../../api';
import { PER } from '../../helpers';
import AppSelect from './SelectField';
import AppTextField from './TextField';
import { EstimateCtx } from '../../App';

const AppHeader = (props) => {
  const { users, currentProject, setIssues } = props;

  const { setIsEst, isEst } = useContext(EstimateCtx);

  const [loadMore, setLoadMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState({
    prjId: currentProject.key,
    issuesId: null,
    userId: null,
    per: PER,
  });

  useEffect(() => {
    getIssues();
  }, [value]);

  useEffect(() => {
    const fetchIssueByEst = async () => {
      if (isEst) {
        await getIssues();
        setIsEst(false);
      }
    }

    fetchIssueByEst();
  },[isEst]);

  const getIssues = async () => {
    value.cb?.(true);

    const res = await api.getListIssueByJQL(value);
    setIssues(res.ok ? res.body.issues : []);

    value.cb?.(false);
  };

  const onSubmit = (val) => {
    setValue({
      ...value,
      userId: val.userId?.value,
      issuesId: val.issuesId,
      per: PER,
      cb: setSubmitting
    });
  };

  const onLoadMore = () => {
    setValue({ ...value, per: value.per + PER, cb: setLoadMore });
  };

  return (
    <Form onSubmit={onSubmit}>
      {({ formProps }) => {

        return (
          <form {...formProps}>
            <Row>
              <Col>
                <Field name="issuesId">
                  {({ fieldProps }) => <AppTextField {...fieldProps}/>}
                </Field>
              </Col>
              <Col>
                <Field name="userId">
                  {({ fieldProps }) => <AppSelect data={users} {...fieldProps} />}
                </Field>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <LoadingButton
                      type="submit"
                      appearance="primary"
                      isLoading={submitting}
                      isDisabled={loadMore}
                      style={{ width: '100%' }}
                    >
                      Search
                    </LoadingButton>
                  </Col>
                  <Col>
                    <LoadingButton
                      isLoading={loadMore}
                      isDisabled={submitting}
                      onClick={onLoadMore}
                      style={{ width: '100%' }}
                    >
                      More
                    </LoadingButton>
                  </Col>
                </Row>
              </Col>
            </Row>
          </form>
        );
      }}
    </Form>
  );
};


const Row = Styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div:first-child {
        padding-right: 16px;
        padding-left: 0;
    }    
    > div:last-child {
        padding-right: 0px;
        padding-left: 16px;
    }
    > div {
        padding: 0 16px;
    }
`;

const Col = Styled.div`
    flex: 1;
    height: 100%;
`;

export default AppHeader;