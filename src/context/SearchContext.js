import React from 'react'

const SearchContext = React.createContext({
  searchInput: '',
  setSearchInput: () => {},
  searchedPosts: [],
  setSearchedPosts: () => {},
  initiateOnPostLike: () => {},
  setFailure: () => {},
  isSearchIconClicked: false,
  isFailure: false,
  setLoading: () => {},
  isLoading: false,
  resetSearchButton: () => {},
  resetFailure: () => {},
})

export default SearchContext
