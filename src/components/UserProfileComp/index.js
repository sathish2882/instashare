import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserProfileComp extends Component {
  state = {
    profile: [],
    profileStories: [],
    profilePosts: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
  }

  getProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/insta-share/users/${id}`
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
      console.log(data.user_details, 'sathish')

      const formattedProfile = {
        id: data.user_details.id,
        userId: data.user_details.user_id,
        userName: data.user_details.user_name,
        profilePic: data.user_details.profile_pic,
        followersCount: data.user_details.followers_count,
        followingCount: data.user_details.following_count,
        userBio: data.user_details.user_bio,
        postsCount: data.user_details.posts_count,
      }

      console.log(formattedProfile)

      this.setState({
        profile: formattedProfile,
        profilePosts: data.user_details.posts,
        profileStories: data.user_details.stories,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="user-profile-loader" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container-profile">
      <img
        className="profile-failure-img"
        src="https://res.cloudinary.com/dziwdneks/image/upload/v1675454266/HomeFaillureImg_qz05si.png"
        alt="failure view"
      />
      <p className="profile-heading-failure">
        Something went wrong. Please try again
      </p>
      <button
        onClick={() => this.getProfile()}
        type="submit"
        className="profile-button-failure"
      >
        Try again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {profile, profilePosts, profileStories} = this.state

    const {
      followersCount,
      followingCount,
      userBio,
      userId,
      userName,
      postsCount,
      profilePic,
    } = profile

    return (
      <div>
        <div className="profile-image-container">
          <img src={profilePic} alt="user profile" className="profile-img" />

          <div>
            <h1 className="profile-username">{userName}</h1>
            <div className="count-container">
              <p className="count-text">
                <span className="count">{postsCount}</span> posts
              </p>
              <p className="count-text">
                <span className="count">{followersCount}</span> followers
              </p>
              <p className="count-text">
                <span className="count">{followingCount}</span> following
              </p>
            </div>
            <p className="user-id">{userId}</p>
            <p className="bio">{userBio}</p>
          </div>
        </div>

        <ul className="profile-stories-container">
          {profileStories.map(eachStory => (
            <li className="profile-story-item" key={eachStory.id}>
              <img
                src={eachStory.image}
                alt="user story"
                className="profile-story-img"
              />
            </li>
          ))}
        </ul>
        <div>
          <hr />
        </div>
        <div className="posts-heading-div">
          <BsGrid3X3 className="grid-icon" />
          <h1 className="posts-heading">Posts</h1>
        </div>
        {profilePosts.length > 0 ? (
          <ul className="profile-posts-container">
            {profilePosts.map(eachPost => (
              <li className="profile-post" key={eachPost.id}>
                <img
                  src={eachPost.image}
                  alt="user post"
                  className="profile-post-img"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="my_profile_no_post_div">
            <BiCamera className="cameraIcon" />
            <h1 className="no_posts_heading">No Posts Yet</h1>
          </div>
        )}
      </div>
    )
  }

  renderMyProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="profile-container">
        <Header />
        {this.renderMyProfile()}
      </div>
    )
  }
}

export default UserProfileComp
