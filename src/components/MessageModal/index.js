import React, { useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';

import './MessageModal.scss';

const ProgressModal = () => {
  const [isDisabled, isOpen, message] = useSelector(
    state => [
      selectors.isElementDisabled(state, 'messageModal'),
      selectors.isElementOpen(state, 'messageModal'),
      selectors.getModalMessage(state),
    ],
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi itaque quam esse ab blanditiis provident asperiores officia, natus fugiat in quaerat ratione, eveniet est aperiam eum vero facere explicabo tempora.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
