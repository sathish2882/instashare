import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import SearchContext from '../../context/SearchContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 3,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },

    {
      breakpoint: 600,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 3,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
      },
    },
  ],
}

class Stories extends Component {
  state = {stories: [], apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getStories()
  }

  getStories = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/insta-share/stories'
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

      const formattedStories = data.users_stories.map(each => ({
        userId: each.user_id,
        userName: each.user_name,
        storyUrl: each.story_url,
      }))

      this.setState({
        stories: formattedStories,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="user-story-loader" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/dziwdneks/image/upload/v1675454266/HomeFaillureImg_qz05si.png"
        alt="failure view"
        className="user-story-failure-img"
      />
      <h1 className="failure-heading-stories">
        Something went wrong. Please try again
      </h1>
      <button
        onClick={() => this.getStories()}
        type="submit"
        className="failure-button-stories"
      >
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {stories} = this.state
    return (
      <SearchContext.Consumer>
        {value => {
          const {searchInput} = value

          return (
            <div className="slick-container">
              {searchInput === '' ? (
                <Slider {...settings}>
                  {stories.map(each => (
                    <div className="slick-item" key={each.userId}>
                      <img
                        className="logo-image"
                        src={each.storyUrl}
                        alt="user story"
                      />
                      <p className="story-username">{each.userName}</p>
                    </div>
                  ))}
                </Slider>
              ) : null}
            </div>
          )
        }}
      </SearchContext.Consumer>
    )
  }

  renderUserStories = () => {
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
    return <div className="main-container">{this.renderUserStories()}</div>
  }
}

export default Stories
