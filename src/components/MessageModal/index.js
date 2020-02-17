import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';

import './MessageModal.scss';

const MessageModal = () => {
  const [isDisabled, isOpen, message] = useSelector(
    state => {
      return [
        selectors.isElementDisabled(state, 'messageModal'),
        selectors.isElementOpen(state, 'messageModal'),
        selectors.getModalMessage(state),
      ];
    },
    shallowEqual,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isOpen) {
      dispatch(
        actions.closeElements([
          'signatureModal',
          'printModal',
          'errorModal',
          'loadingModal',
          'passwordModal',
        ]),
      );
    }
  }, [dispatch, isOpen]);

  return isDisabled ? null : (
    <div
      className={classNames({
        Modal: true,
        MessageModal: true,
        open: isOpen,
        closed: !isOpen,
      })}
      data-element="messageModal"
    >
      <div className="container">
        <div className="message-wrapper">
          <div
            className="message"
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
