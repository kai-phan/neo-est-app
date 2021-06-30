import React, { Fragment, useCallback, useContext } from 'react';
import Form, { Field, ErrorMessage } from '@atlaskit/form';
import Textfield from '@atlaskit/textfield';
import styled from 'styled-components';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

import api from '../../api';
import { EstimateCtx } from '../../App';

const EstimateModal = ({ issue, action }) => {
  const { setIsEst, isEst } = useContext(EstimateCtx);
  const close = () => action({ action: 'hide-details' });

  const CustomContainer = useCallback((props) => {
    return (
      <Form onSubmit={onSubmit}>
        {({ formProps }) => (
          <form
            {...props}
            {...formProps}
          >
            {props.children}
          </form>
        )}
      </Form>
    );
  }, []);

  const onSubmit = async (val) => {
    setIsEst(true);
    const payload = {
      update: {
        timetracking: [
          {
            edit: {
              originalEstimate: val.originalEstimate,
              remainingEstimate: val.originalEstimate,
            }
          }
        ]
      }
    };

    await api.putEstimate({ payload, issueId: issue.id });
    close();
  };


  const validate = (value) => {
    const patt = new RegExp('^([0-9]+([.][0-9]+)?[wdhm])([ ][0-9]+([.][0-9]+)?[wdhm])*$');
    return patt.test(value) ? undefined : 'INCORRECT_PHRASE';
  };

  return (
    <ModalWrapper>
      <ModalTransition>
        {issue && (
          <Modal
            actions={[
              { text: 'Create', type: 'submit', isLoading: isEst },
              { text: 'Close', onClick: close },
            ]}
            components={{
              Container: CustomContainer,
            }}
            onClose={close}
            heading="Estimate your work"
            width="small"
          >
            <Field
              id="origin"
              name="originalEstimate"
              label="Original estimate"
              validate={validate}
            >
              {({ fieldProps, error }) => (
                <Fragment>
                  <Textfield
                    placeholder="1w 4d 6h 30m"
                    defaultValue={issue.estimated}
                    {...fieldProps}
                  />
                  {error === 'INCORRECT_PHRASE' && (
                    <ErrorMessage>
                      You must input the format of 1w 4d 6h 30m
                    </ErrorMessage>
                  )}
                </Fragment>
              )}
            </Field>
          </Modal>
        )}
      </ModalTransition>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  .css-22oatl-Blanket {
    background-color: white;
  }
`;

export default EstimateModal;