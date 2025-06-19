import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {FaBars, FaSearch} from 'react-icons/fa'
import {MdCancel} from 'react-icons/md'

import SearchContext from '../../context/SearchContext'
import './index.css'

class Header extends Component {
  state = {
    isMobileView: false,
    showSearch: false,
  }

  onBar = () => {
    this.setState({isMobileView: true, showSearch: false})
  }

  onCancel = () => {
    this.setState({isMobileView: false})
  }

  onLogout = () => {
    const {history} = this.props

    Cookies.remove('jwt_token')

    history.replace('/login')
  }

  onSearchMobile = () => {
    this.setState(prevState => ({
      showSearch: !prevState.showSearch,
    }))
  }

  render() {
    const {isMobileView, showSearch} = this.state

    const {location} = this.props
    const currentPath = location.pathname

    return (
      <SearchContext.Consumer>
        {value => {
          const {setSearchInput, searchInput, setSearchedPosts} = value
          const {setLoading, setFailure, resetFailure} = value
          const {resetSearchButton} = value

          const changeSearchText = async event => {
            setSearchInput(event.target.value)
            resetSearchButton()
          }

          const getSearchedPost = async () => {
            setLoading()
            console.log(searchInput)
            console.log('btn-clicked')

            const url = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
            const jwtToken = Cookies.get('jwt_token')
            const options = {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
              method: 'GET',
            }

            const response = await fetch(url, options)

            if (response.ok) {
              const data = await response.json()

              const formattedPosts = data.posts.map(each => ({
                postId: each.post_id,
                userId: each.user_id,
                userName: each.user_name,
                profilePic: each.profile_pic,
                postDetails: {
                  imageUrl: each.post_details.image_url,
                  caption: each.post_details.caption,
                },
                likesCount: each.likes_count,
                comments: each.comments,

                createdAt: each.created_at,
              }))

              setSearchedPosts(formattedPosts)

              resetFailure()
            } else {
              setFailure()
            }
          }

          return (
            <nav className="nav">
              <div className="container">
                <div className="name-container">
                  <Link className="link" to="/">
                    <img
                      className="website-img"
                      src="https://res.cloudinary.com/dq9zq6ubg/image/upload/v1747975559/Standard_Collection_8_1_zonsa5.png"
                      alt="website logo"
                    />
                  </Link>
                  <h1 className="app-name">Insta Share</h1>
                </div>

                <ul className="large-container">
                  <li>
                    <div className="search-container">
                      <input
                        placeholder="Search Caption"
                        className="search"
                        type="search"
                        onChange={changeSearchText}
                        value={searchInput}
                      />
                      <button
                        testid="searchIcon"
                        onClick={getSearchedPost}
                        className="search-btn"
                        type="button"
                      >
                        <FaSearch className="search-icon" />
                      </button>
                    </div>
                  </li>
                  <Link className="link" to="/">
                    <li
                      className={`item ${
                        currentPath === '/' ? 'active-tab' : ''
                      }`}
                    >
                      Home
                    </li>
                  </Link>

                  <Link className="link" to="/my-profile">
                    <li
                      className={`item ${
                        currentPath === '/my-profile' ? 'active-tab' : ''
                      }`}
                    >
                      Profile
                    </li>
                  </Link>
                  <li className="logout-large">
                    <button
                      onClick={this.onLogout}
                      className="logout-btn-mobile"
                      type="button"
                    >
                      Logout
                    </button>
                  </li>
                </ul>

                <button onClick={this.onBar} className="bar-btn" type="button">
                  <FaBars className="bar" />
                </button>
              </div>
              {isMobileView && !showSearch && (
                <div className="mobile-view">
                  <ul className="mobile-view-container">
                    <Link className="link" to="/">
                      <li
                        className={`item ${
                          currentPath === '/' ? 'active-tab' : ''
                        }`}
                      >
                        Home
                      </li>
                    </Link>

                    <li
                      onClick={this.onSearchMobile}
                      className={`item ${showSearch ? 'active-tab' : ''}`}
                    >
                      Search
                    </li>

                    <Link className="link" to="/my-profile">
                      <li
                        className={`item ${
                          currentPath === '/my-profile' ? 'active-tab' : ''
                        }`}
                      >
                        Profile
                      </li>
                    </Link>

                    <li>
                      <button
                        onClick={this.onLogout}
                        className="logout-btn-mobile"
                        type="button"
                      >
                        Logout
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={this.onCancel}
                        className="cancel-btn"
                        type="button"
                      >
                        <MdCancel className="cancel" />
                      </button>
                    </li>
                  </ul>
                </div>
              )}
              {showSearch && (
                <div className="search-container-small">
                  <input
                    placeholder="Search Caption"
                    className="search"
                    type="search"
                    onChange={changeSearchText}
                    value={searchInput}
                  />
                  <button
                    testid="searchIcon"
                    onClick={getSearchedPost}
                    className="search-btn"
                    type="button"
                  >
                    <FaSearch className="search-icon" />
                  </button>
                </div>
              )}
            </nav>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}

export default withRouter(Header)
