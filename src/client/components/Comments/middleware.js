/* eslint-disable no-unused-vars */
import { COMMENTS_POST_TO_THREAD_SUCCESS } from './actionTypes';

const commentsMiddleware = store => next => (action) => {
  if (action.type === COMMENTS_POST_TO_THREAD_SUCCESS) {
    // Deprecated as for the use case is not valid anymore.
    // const state = store.getState();
    // store.dispatch(fetchCommentsThread(state.comments.threadId));
  }
  next(action);
};

export default commentsMiddleware;
