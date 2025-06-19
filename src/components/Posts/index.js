import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import PostItem from '../PostItem'
import SearchPostItem from '../SearchPostItem'
import SearchContext from '../../context/SearchContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Posts extends Component {
  state = {
    posts: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getPosts()
  }

  getPosts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/insta-share/posts'
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

      console.log(formattedPosts)

      this.setState({
        posts: formattedPosts,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onPostLike = async (postId, likeStatus) => {
    const {posts} = this.state
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
    let userPostsData = posts
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

    this.setState({posts: userPostsData})
  }

  renderLoadingView = () => (
    <div className="user-posts-loader" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container-posts">
      <img
        className="failure-img-posts"
        src="https://res.cloudinary.com/dziwdneks/image/upload/v1675775097/alert-triangle_cyhzqu.png"
        alt="failure view"
      />
      <p className="failure-heading-posts">
        Something went wrong. Please try again
      </p>
      <button
        onClick={() => this.getPosts()}
        type="submit"
        className="failure-button-posts"
      >
        Try again
      </button>
    </div>
  )

  noSearchResults = () => (
    <div className="no-results-container">
      <img
        className="no-results-img"
        src="https://res.cloudinary.com/dziwdneks/image/upload/v1675513323/SearchNotFound_ntqrqa.png"
        alt="search not found"
      />
      <h1 className="no-results-heading">Search Not Found</h1>
      <p className="no-results-para">Try different keyword or search again</p>
    </div>
  )

  renderSuccessViewPosts = () => {
    const {posts} = this.state

    return (
      <div className="posts-list">
        <hr className="below-story-min-divice-hr-tag" />
        {posts.map(eachPost => (
          <PostItem
            onPostLike={this.onPostLike}
            key={eachPost.postId}
            eachPost={eachPost}
          />
        ))}
      </div>
    )
  }

  renderSuccessViewSearchPosts = () => (
    <SearchContext.Consumer>
      {value => {
        const {searchedPosts} = value

        return (
          <div className="posts-list">
            <h1 className="search-results-heading">Search Results</h1>
            {searchedPosts.map(eachPost => (
              <SearchPostItem
                onPostLike={this.onPostLike}
                key={eachPost.postId}
                eachPost={eachPost}
              />
            ))}
          </div>
        )
      }}
    </SearchContext.Consumer>
  )

  renderConditionForSearchResults = (isFailure, isSearchIconClicked) => {
    const {searchPosts} = this.state
    console.log(searchPosts, 'condition,posts')

    return (
      <SearchContext.Consumer>
        {value => {
          const {searchedPosts} = value

          if (!isFailure && isSearchIconClicked) {
            if (searchedPosts.length > 0) {
              return this.renderSuccessViewSearchPosts()
            }
            return this.noSearchResults()
          }
          return null
        }}
      </SearchContext.Consumer>
    )
  }

  renderUserPosts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessViewPosts()
      default:
        return null
    }
  }

  render() {
    return (
      <SearchContext.Consumer>
        {value => {
          const {searchInput, isSearchIconClicked, isFailure} = value
          const {isLoading} = value

          console.log()

          return (
            <div className="posts-container">
              {searchInput === '' && this.renderUserPosts()}
              {isLoading && this.renderLoadingView()}
              {this.renderConditionForSearchResults(
                isFailure,
                isSearchIconClicked,
              )}
              {isFailure && this.renderFailureView()}
            </div>
          )
        }}
      </SearchContext.Consumer>
    )
  }
}

export default Posts
