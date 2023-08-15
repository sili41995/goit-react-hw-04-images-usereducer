import initialState from 'constants/initialState';

const imagesReducer = (state, action) => {
  switch (action.type) {
    case 'setStatus':
      return { ...state, status: action.payload };

    case 'setImages':
      return { ...state, images: [...state.images, ...action.payload] };

    case 'setTotalImages':
      return { ...state, totalImages: action.payload };

    case 'incrementPage':
      return { ...state, page: state.page + action.payload };

    case 'setSearchQuery':
      return { ...initialState, searchQuery: action.payload };

    default:
      return state;
  }
};

export default imagesReducer;
