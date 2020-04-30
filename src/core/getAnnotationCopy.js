export default annotation => {
  const cpy = window.docViewer.getAnnotationManager().getAnnotationCopy(annotation);
  if (annotation.CustomData) {
    cpy.CustomData = { ...annotation.CustomData };
  }
  return cpy;
};