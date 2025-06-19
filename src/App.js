import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import SearchContext from './context/SearchContext'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'
import UserProfileComp from './components/UserProfileComp'

import MyProfile from './components/MyProfile'

import Home from './components/Home'

import './App.css'

class App extends Component {
  state = {
    searchInput: '',
    searchedPosts: [],
    isSearchIconClicked: false,
    isFailure: false,
    isLoading: false,
  }

  clearSearchInput = () => {
    this.setState({
      searchInput: '',
      searchedPosts: [],
      isSearchIconClicked: false,
    })
  }

  setSearchInput = searchInput => {
    this.setState({searchInput})
  }

  setLoading = () => {
    this.setState({isLoading: true})
  }

  setSearchedPosts = formattedPosts => {
    this.setState({
      searchedPosts: formattedPosts,
      isSearchIconClicked: true,
      isLoading: false,
    })
  }

  resetFailure = () => {
    this.setState({isFailure: false, isLoading: false})
  }

  resetSearchButton = () => {
    this.setState({
      isSearchIconClicked: false,
    })
  }

  setFailure = () => {
    this.setState({isFailure: true})
  }

  initiateOnPostLike = async (postId, likeStatus) => {
    const {searchedPosts} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const likeDetails = {
      like_status: likeStatus,
    }
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(likeDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    let userPostsData = searchedPosts
    userPostsData = userPostsData.map(eachObject => {
      if (eachObject.postId === postId && likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likesCount: eachObject.likesCount + 1,
        }
      }
      if (eachObject.postId === postId && !likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likesCount: eachObject.likesCount - 1,
        }
      }

      return eachObject
    })

    this.setState({searchedPosts: userPostsData})
  }

  render() {
    const {searchInput, searchedPosts, isSearchIconClicked} = this.state
    const {isLoading} = this.state
    console.log(searchedPosts, 'array')
    const {isFailure} = this.state
    console.log(searchInput)
    return (
      <SearchContext.Provider
        value={{
          searchInput,
          isFailure,
          isLoading,
          setSearchInput: this.setSearchInput,
          searchedPosts,
          setSearchedPosts: this.setSearchedPosts,
          initiateOnPostLike: this.initiateOnPostLike,
          setFailure: this.setFailure,
          isSearchIconClicked,
          setLoading: this.setLoading,
          resetSearchButton: this.resetSearchButton,
          resetFailure: this.resetFailure,
          clearSearchInput: this.clearSearchInput,
        }}
      >
        <>
          <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/my-profile" component={MyProfile} />
            <ProtectedRoute
              exact
              path="/users/:id"
              component={UserProfileComp}
            />
            <NotFound exact path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </>
      </SearchContext.Provider>
    )
  }
}

export default App
