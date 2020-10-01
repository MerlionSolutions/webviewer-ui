import core from 'core';
import { isTabletOrMobile } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';
import _ from 'lodash';

export default store => evt => {
  const signatureTool = core.getTool('AnnotationCreateSignature');

  const savedSigs = signatureTool.getSavedSignatures();
  const annotManager = core.getAnnotationManager();
  const annots = annotManager.getAnnotationsList();
  const currUser = annotManager.getCurrentUser();

  const sigWig = _.chain(annots)
    .filter(el => el instanceof Annotations.SignatureWidgetAnnotation)
    .filter(el => el.X <= evt.x && el.X + el.Width > evt.x)
    .filter(el => el.Y <= evt.y && el.Y + el.Height > evt.y)
    .head()
    .value();

  if (sigWig) {
    const [sigwigType, , id] = sigWig.getField().name.split('.');
    const savedSig = _.find(savedSigs, sig => sig.CustomData.type === sigwigType && sig.Author === currUser);
    if (savedSig) {
      const sig = annotManager.getAnnotationCopy(savedSig);
      sig.CustomData = _.omit(_.cloneDeep(savedSig.CustomData), ['corrId']);

      sig.CustomData.sigWigId = id;
      sig.CustomData.widgetId = id;
      sig.setCustomData('widgetId', id);
      signatureTool.setSignature(sig);

      return new Promise(res => setTimeout(() => {
        if (!signatureTool.isEmptySignature()) {
          signatureTool.one('annotationAdded', annot => {
            annot.CustomData = sig.CustomData;
          });
          signatureTool.addSignature();
          return res();
        }
      }, 100));
    } else {
      const disableOnetimeListeners = _.once(() => {
        signatureTool.off('annotationAdded', onAnnotationAdded);
        signatureTool.off('signatureSaved', onAnnotationAdded);
      });
      const onAnnotationAdded = _.once(sigs => {
        const sig = _.head(_.castArray(sigs));
        sig.CustomData.type = sigwigType;
        sig.CustomData.sigWigId = id;
        sig.CustomData.widgetId = id;
        sig.setCustomData('widgetId', id);
        signatureTool.setSignature(sig);
        signatureTool.off('signatureModalClosed', disableOnetimeListeners);
      });

      signatureTool.on('annotationAdded', onAnnotationAdded);
      signatureTool.on('signatureSaved', onAnnotationAdded);

      signatureTool.on('signatureModalClosed', disableOnetimeListeners);
      return store.dispatch(actions.openSignatureModal(sigwigType ? sigwigType : 'signature', sigWig.Id));
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
