import Header from '../Header'
import Stories from '../Stories'
import SearchContext from '../../context/SearchContext'
import Posts from '../Posts'
import './index.css'

const Home = () => (
  <SearchContext.Consumer>
    {value => {
      const {searchedPosts} = value
      console.log(searchedPosts, 'home')

      return (
        <div className="home">
          <Header />
          <Stories />
          <Posts />
        </div>
      )
    }}
  </SearchContext.Consumer>
)

export default Home
