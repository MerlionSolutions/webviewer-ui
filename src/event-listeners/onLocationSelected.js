import core from 'core';
import { isTabletOrMobile } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';

export default store => async evt => {
  const signatureTool = core.getTool('AnnotationCreateSignature');

  const savedSigs = signatureTool.getSavedSignatures();
  const annotMgr = window.docViewer.getAnnotationManager();
  const annots = annotMgr.getAnnotationsList();
  const currUser = annotMgr.getCurrentUser();

  const sigWig = _.chain(annots)
    .filter(el => el instanceof Annotations.SignatureWidgetAnnotation)
    .filter(el => el.X <= evt.x && el.X + el.Width > evt.x)
    .filter(el => el.Y <= evt.y && el.Y + el.Height > evt.y)
    .head()
    .value();

  let sigwigType;
  if (sigWig) {
    sigwigType = sigWig.getField().name.split('.')[0];
    const savedSig = _.find(savedSigs, sig => sig.CustomData.type === sigwigType && sig.Author === currUser);
    if (savedSig) {
      savedSig.CustomData = { ..._.cloneDeep(sigWig.CustomData), sigwigId: sigWig.CustomData.id };
      signatureTool.setSignature(savedSig);
      return new Promise(res => setTimeout(() => {

        if (!signatureTool.isEmptySignature()) {
          signatureTool.addSignature();
          res();
        }

      }, 100));
    }

  }






  if (!signatureTool.isEmptySignature()) {
    signatureTool.addSignature();
  } else {
    // this condition is usually met when we click on a signature widget but UI doesn't know which signature to draw
    // if signatureToolButton is not disabled then we click on it programmatically
    // otherwise we check if there are saved signatures in the signature overlay to determine which component we should open
    const signatureToolButton = document.querySelector('[data-element="signatureToolButton"]');

    if (signatureToolButton) {
      if (isTabletOrMobile()) {
        store.dispatch(actions.setActiveHeaderGroup('tools'));
      }
      document.querySelector('[data-element="signatureToolButton"] .Button').click();
      store.dispatch({
        type: 'OPEN_SIGNATURE_MODAL',
        payload: {
          clickedSigWidget: (sigWig) ? sigWig.Id : null,
          type: sigwigType ? sigwigType : 'signature'
        }
      });
    } else {
      const defaultSignatures = document.querySelector('.default-signature');
      const isSignatureOverlayDisabled = selectors.isElementDisabled(store.getState(), 'signatureOverlay');

      if (defaultSignatures && !isSignatureOverlayDisabled) {
        store.dispatch(actions.openElement('signatureOverlay'));
      } else {
        store.dispatch(actions.openElement('signatureModal'));
      }
    }
  }
};
