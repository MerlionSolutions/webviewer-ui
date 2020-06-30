import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import ActionButton from 'components/ActionButton';

import core from 'core';
import getClassName from 'helpers/getClassName';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import getAnnotationStyles from 'helpers/getAnnotationStyles';
import actions from 'actions';
import selectors from 'selectors';
import _ from 'lodash';

import './SignatureOverlay.scss';

class SignatureOverlay extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isSignatureModalOpen: PropTypes.bool,
    closeElements: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    openElement: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    maxSignaturesCount: PropTypes.number.isRequired,
    maxInitialsCount: PropTypes.number.isRequired,
    openSignatureModal: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.signatureTool = core.getTool('AnnotationCreateSignature');
    this.overlay = React.createRef();
    this.currentSignatureIndex = null;
    this.state = {
      defaultSignatures: [],
      left: 0,
      right: 'auto',
    };
  }

  componentDidMount() {
    this.signatureTool.on('signatureSaved', this.onSignatureSaved);
    this.signatureTool.on('signatureDeleted', this.onSignatureDeleted);
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([
        'viewControlsOverlay',
        'menuOverlay',
        'toolsOverlay',
        'zoomOverlay',
        'toolStylePopup',
      ]);
      this.setOverlayPosition();
    }

    if (
      prevProps.isOpen &&
      !this.props.isOpen &&
      !this.props.isSignatureModalOpen &&
      this.signatureTool.isEmptySignature()
    ) {
      // location of signatureTool will be set when clicking on a signature widget
      // we want to clear location when the overlay is closed without any default signatures selected
      // to prevent signature from being drawn to the previous location
      // however the overlay will be closed without any default signature selected if we clicked the "add signature" button(which opens the signature modal)
      // we don't want to clear the location in the case because we still want the signature to be automatically added to the widget after the create button is hit in the modal
      this.signatureTool.clearLocation();
    }
  }

  componentWillUnmount() {
    this.signatureTool.off('signatureSaved', this.onSignatureSaved);
    this.signatureTool.off('signatureDeleted', this.onSignatureDeleted);
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleClickOutside = e => {
    const clickedSignatureButton = e.target.getAttribute('data-element') === 'signatureToolButton';

    if (!clickedSignatureButton) {
      this.props.closeElement('signatureOverlay');
    }
  };

  handleWindowResize = () => {
    this.setOverlayPosition();
  };

  setOverlayPosition = () => {
    const signatureToolButton = document.querySelector('[data-element="signatureToolButton"]');

    if (!signatureToolButton && this.overlay.current) {
      // the button has been disabled using instance.disableElements
      // but this component can still be opened by clicking on a signature widget
      // in this case we just place it in the center
      const { width } = this.overlay.current.getBoundingClientRect();
      this.setState({ left: (window.innerWidth - width) / 2, right: 'auto' });
    } else {
      this.setState(getOverlayPositionBasedOn('signatureToolButton', this.overlay, 'center'));
    }
  };

  onSignatureSaved = async annotations => {
    // const numberOfSignaturesToRemove = this.state.defaultSignatures.length + annotations.length - this.props.maxSignaturesCount;
    
    // const defaultSignatures = [...this.state.defaultSignatures];

    // if (numberOfSignaturesToRemove > 0) {
    //   // to keep the UI sync with the signatures saved in the tool
    //   for (let i = 0; i < numberOfSignaturesToRemove; i++) {
    //     this.signatureTool.deleteSavedSignature(0);
    //   }

    //   defaultSignatures.splice(0, numberOfSignaturesToRemove);
    // }

    const savedSignatures = await this.getSignatureDataToStore(annotations);
    this.setState({
      defaultSignatures: this.state.defaultSignatures.concat(savedSignatures),
    });
  };

  onSignatureDeleted = async(annotation, index) => {
    if (!this.state.defaultSignatures.length) {
      return;
    }

    const savedSignatures = [...this.state.defaultSignatures];
    savedSignatures.splice(index, 1);

    this.setState({
      defaultSignatures: await this.getSignatureDataToStore(
        savedSignatures.map(({ annotation }) => annotation)
      ),
    });
  };

  onAnnotationChanged = async(annotations, action) => {
    if (
      action === 'modify' &&
      annotations.length === 1 &&
      annotations[0].ToolName === 'AnnotationCreateSignature'
    ) {
      const newStyles = getAnnotationStyles(annotations[0]);
      let annotationsWithNewStyles = this.state.defaultSignatures.map(({ annotation }) =>
        Object.assign(annotation, newStyles)
      );
      annotationsWithNewStyles = await this.getSignatureDataToStore(annotationsWithNewStyles);

      this.setState({
        defaultSignatures: annotationsWithNewStyles,
      });
    }
  };

  // returns an array of objects in the shape of: { annotation, preview }
  // annotation: a copy of the annotation passed in
  // imgSrc: preview of the annotation, a base64 string
  getSignatureDataToStore = async annotations => {
    // copy the annotation because we need to mutate the annotation object later if there're any styles changes
    // and we don't want the original annotation to be mutated as well
    // since it's been added to the canvas
    const copiedAnnotations = annotations.map(annot => {
      const copy = core.getAnnotationCopy(annot);

      copy.CustomData.origId = annot.CustomData.origId || annot.Id;
      copy.CustomData.type = annot.CustomData.type;
      return copy;
    });
    const previews = await Promise.all(copiedAnnotations.map(annotation => this.signatureTool.getPreview(annotation)));

    return copiedAnnotations.map((annotation, i) => ({
      annotation,
      author: annotation.Author,
      id: annotations[i].Id,
      origId: annotations[i].CustomData.origId || annotations[i].Id,
      imgSrc: previews[i],
    }));
  };

  setSignature = id => {
    this.currentSignatureIndex = id;

    const { annotation } = _.find(this.state.defaultSignatures, s => s.id === id) || {};

    core.setToolMode('AnnotationCreateSignature');
    this.signatureTool.setSignature(annotation);
    this.props.closeElement('signatureOverlay');

    if (this.signatureTool.hasLocation()) {
      this.signatureTool.addSignature();
    } else {
      this.signatureTool.showPreview();
    }
  };

  deleteDefaultSignature = id => {

    const savedSigs = this.signatureTool.getSavedSignatures();
    const toDelIndex = _.findIndex(savedSigs, sig => sig.Id === id);
    if (toDelIndex < 0) {
      console.error('could not find signature to delete!');
      return;
    }
    this.signatureTool.deleteSavedSignature(toDelIndex);

    const isDeletingCurrentSignature = this.currentSignatureIndex === id;
    if (isDeletingCurrentSignature) {
      this.signatureTool.annot = null;
      this.signatureTool.hidePreview();
      this.currentSignatureIndex = null;
    }
  };

  openSignatureModal = () => {
    const { defaultSignatures } = this.state;
    const { openSignatureModal, maxSignaturesCount } = this.props;
    this.props.setSigType('signature');


    const sigs = _.filter(defaultSignatures, el => el.annotation.CustomData.type === 'signature');
    if (sigs.length < maxSignaturesCount) {
      openSignatureModal('signature');
    }
  };

  openInitialsModal = () => {
    const { defaultSignatures } = this.state;
    const { openSignatureModal, maxInitialsCount } = this.props;
    this.props.setSigType('initials');
 
    const sigs = _.filter(defaultSignatures, el => el.annotation.CustomData.type === 'initials');
    if (sigs.length < maxInitialsCount) {
      openSignatureModal('initials');
    }
  };

  render() {
    const { left, right, defaultSignatures } = this.state;
    const { t, isDisabled, maxSignaturesCount, maxInitialsCount } = this.props;
    const className = getClassName('Overlay SignatureOverlay', this.props);
    const defSigs = _.filter(defaultSignatures, ({ annotation, author }) => annotation.CustomData.type === 'signature' && author === this.props.userName);
    const defInitials = _.filter(defaultSignatures, ({ annotation, author }) => annotation.CustomData.type === 'initials' && author === this.props.userName);

    if (isDisabled) {
      return null;
    }

    return (
      <div className={className} ref={this.overlay} style={{ left, right }}>
        <div className="default-signatures-container">
          {defSigs.map(({ origId: id, imgSrc }, index) => (
            <div className="default-signature" key={index}>
              <div className="signature-image" onClick={() => this.setSignature(id)}>
                <img src={imgSrc} />
              </div>
              <ActionButton
                dataElement="defaultSignatureDeleteButton"
                img="ic_delete_black_24px"
                onClick={() => this.deleteDefaultSignature(id)}
              />
            </div>
          ))}
          <div
            className={`add-signature${defSigs.length >= maxSignaturesCount ? ' disabled' : ' enabled'}`}
            onClick={this.openSignatureModal}
          >
            Add Signature
          </div>
        </div>
        <div className="default-signatures-container">
          {defInitials.map(({ origId: id, imgSrc }, index) => (
            <div className="default-signature" key={index}>
              <div className="signature-image" onClick={() => this.setSignature(id)}>
                <img src={imgSrc} />
              </div>
              <ActionButton
                dataElement="defaultSignatureDeleteButton"
                img="ic_delete_black_24px"
                onClick={() => this.deleteDefaultSignature(id)}
              />
            </div>
          ))}
          <div
            className={`add-signature${defInitials.length >= maxInitialsCount ? ' disabled' : ' enabled'}`}
            onClick={this.openInitialsModal}
          >
            Add Initials
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'signatureOverlay'),
  isOpen: selectors.isElementOpen(state, 'signatureOverlay'),
  isSignatureModalOpen: selectors.isElementOpen(state, 'signatureModal'),
  maxSignaturesCount: selectors.getMaxSignaturesCount(state),
  maxInitialsCount: selectors.getMaxInitialsCount(state),
  userName: selectors.getUserName(state),
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  closeElement: actions.closeElement,
  openElement: actions.openElement,
  openSignatureModal: actions.openSignatureModal,
  setSigType: actions.setSigType,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(onClickOutside(SignatureOverlay)));
