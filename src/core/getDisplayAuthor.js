/**
 * Annotations may set the author to a unique id which isn't suitable for display in the UI.
 * this function gets the author name of the annotation that should be displayed.
 */
export default annotation => {
  if (annotation) {
    return window.docViewer.getAnnotationManager().getDisplayAuthor(annotation);
  } else {
    return window.docViewer.getAnnotationManager().getDisplayAuthor();
  }
};
