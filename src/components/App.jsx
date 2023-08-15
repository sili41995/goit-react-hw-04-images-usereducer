import React, { useEffect, useReducer } from 'react';
import fetchImages from 'service/fetchImages';
import statuses from 'constants/statuses';
import Searchbar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import Button from 'components/Button';
import Loader from 'components/Loader';
import Container from 'components/Container';
import Notification from 'components/Notification';
import { errorToast, successToast } from 'utils/toasts';
import initialState from 'constants/initialState';
import imagesReducer from 'utils/imagesReducer';

export const App = () => {
  const [state, dispatch] = useReducer(imagesReducer, initialState);

  const imagesLength = state.images.length;

  useEffect(() => {
    async function getImages(searchQuery, page) {
      try {
        dispatch({ type: 'setStatus', payload: statuses.pending });
        const { hits: newImages, totalHits } = await fetchImages(
          searchQuery,
          page
        );
        dispatch({ type: 'setImages', payload: newImages });
        dispatch({ type: 'setTotalImages', payload: totalHits });
        dispatch({ type: 'setStatus', payload: statuses.resolved });
        successToast('Images uploaded');
      } catch ({ message }) {
        errorToast(message);
        dispatch({ type: 'setStatus', payload: statuses.rejected });
      }
    }

    state.searchQuery && getImages(state.searchQuery, state.page);
  }, [state.page, state.searchQuery]);

  const onLoadMoreBtnClick = () => {
    dispatch({ type: 'incrementPage', payload: 1 });
  };

  const onSubmitForm = ({ query }) => {
    if (!query.trim()) {
      errorToast('Please, enter search query!');
      return;
    }
    dispatch({ type: 'setSearchQuery', payload: query });
  };

  const lastPage = state.totalImages === imagesLength;
  const { pending, resolved, rejected } = statuses;

  return (
    <>
      <Searchbar onSubmit={onSubmitForm} />
      <Container>
        {!!imagesLength && <ImageGallery images={state.images} />}
        {state.status === pending && <Loader />}
        {!!imagesLength &&
          (state.status === resolved || state.status === rejected) &&
          !lastPage && <Button onLoadMoreBtnClick={onLoadMoreBtnClick} />}
      </Container>
      <Notification />
    </>
  );
};

export default App;
