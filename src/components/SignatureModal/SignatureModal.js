import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';
import ActionButton from 'components/ActionButton';
import { Tabs, Tab, TabPanel } from 'components/Tabs';
import InkSignature from 'components/SignatureModal/InkSignature';
import TextSignature from 'components/SignatureModal/TextSignature';
import ImageSignature from 'components/SignatureModal/ImageSignature';

import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';

import './SignatureModal.scss';

const SignatureModal = () => {
  const [isDisabled, isSaveSignatureDisabled, isOpen, sigType] = useSelector(state => [
    selectors.isElementDisabled(state, 'signatureModal'),
    selectors.isElementDisabled(state, 'saveSignatureButton'),
    selectors.isElementOpen(state, 'signatureModal'),
    selectors.getSigType(state)
  ]);



  const dispatch = useDispatch();
  const [saveSignature, setSaveSignature] = useState(true);
  const [t] = useTranslation();
  const signatureTool = core.getTool('AnnotationCreateSignature');

  const _setSaveSignature = useCallback(
    save => {
      if (!isSaveSignatureDisabled) {
        setSaveSignature(save);
      }
    },
    [isSaveSignatureDisabled],
  );

  useEffect(() => {
    if (isOpen) {
      core.setToolMode('AnnotationCreateSignature');
      dispatch(
        actions.closeElements([
          'printModal',
          'loadingModal',
          'progressModal',
          'errorModal',
        ]),
      );
    }
  }, [_setSaveSignature, dispatch, isOpen]);

  const closeModal = () => {
    signatureTool.clearLocation();
    dispatch(actions.closeElement('signatureModal'));
    core.setToolMode(defaultTool);
  };

  const toggleSaveSignature = () => {
    _setSaveSignature(!saveSignature);
  };

  const createSignature = () => {
    if (!signatureTool.isEmptySignature()) {
      if (saveSignature) {
        signatureTool.annot.setCustomData('type', sigType);
        signatureTool.saveSignatures(signatureTool.annot);
      }
      if (signatureTool.hasLocation()) {
        signatureTool.addSignature();
      } else {
        signatureTool.showPreview();
      }
      dispatch(actions.closeElement('signatureModal'));
    }
  };

  const modalClass = classNames({
    Modal: true,
    SignatureModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <div
      className={modalClass}
      data-element="signatureModal"
      onMouseDown={closeModal}
    >
      <div className="container" onMouseDown={e => e.stopPropagation()}>
        <Tabs id="signatureModal">
          <div className="header">
            <div className="tab-list">
              <Tab dataElement="inkSignaturePanelButton">
                <Button label={t('action.draw')} />
              </Tab>
              <Tab dataElement="textSignaturePanelButton">
                <Button label={t('action.type')} />
              </Tab>
              <Tab dataElement="imageSignaturePanelButton">
                <Button label={t('action.upload')} />
              </Tab>
            </div>
            <ActionButton
              dataElement="signatureModalCloseButton"
              title="action.close"
              img="ic_close_black_24px"
              onClick={closeModal}
            />
          </div>

          <TabPanel dataElement="inkSignaturePanel">
            <InkSignature
              isModalOpen={isOpen}
              _setSaveSignature={_setSaveSignature}
            />
          </TabPanel>
          <TabPanel dataElement="textSignaturePanel">
            <TextSignature
              isModalOpen={isOpen}
              _setSaveSignature={_setSaveSignature}
            />
          </TabPanel>
          <TabPanel dataElement="imageSignaturePanel">
            <ImageSignature
              isModalOpen={isOpen}
              _setSaveSignature={_setSaveSignature}
            />
          </TabPanel>
        </Tabs>

        <div className="footer">
          <div>
            <p>
              By clicking Accept and Sign, I agree that the signature wil be the
              electric representation of my signature for all purposes when I, for
              my agenda, use them on documents. Including legally binding documents, just the same as pen and paper signatures.
            </p>
          </div>
        </div>
        <div
          className="footer"
          style={{
            justifyContent: isSaveSignatureDisabled
              ? 'flex-end'
              : 'space-between',
          }}
        >
          {!isSaveSignatureDisabled && (
            <div className="signature-save" data-element="saveSignatureButton">
              <input
                id="default-signature"
                type="checkbox"
                checked={saveSignature}
                onChange={toggleSaveSignature}
              />
              <label htmlFor="default-signature">
                {(sigType === 'signature') ? t('option.signatureModal.saveSignature') : 'Save Initials'}
              </label>
            </div>
          )}
          <div className="signature-create" onClick={createSignature}>
            {sigType === 'signature' ? 'Accept and create signature' : 'Accept and create initials'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
