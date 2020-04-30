import actions from 'actions';

export default store => () => {
  store.dispatch(actions.hideMessageModal());
};