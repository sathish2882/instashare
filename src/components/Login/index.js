import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', isError: false}

  onUsername = event => {
    this.setState({username: event.target.value})
  }

  onPassword = event => {
    this.setState({password: event.target.value})
  }

  onSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onFailure = errorMsg => {
    console.log(errorMsg)
    this.setState({isError: true, errorMsg})
  }

  onForm = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const url = 'https://apis.ccbp.in/login'

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, isError} = this.state
    console.log(errorMsg)
    console.log(isError)

    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <img
          src="https://res.cloudinary.com/dq9zq6ubg/image/upload/v1747886571/Illustration_1_zxoyjq.png"
          alt="website login"
          className="login-logo"
        />
        <form onSubmit={this.onForm} className="form">
          <img
            src="https://res.cloudinary.com/dq9zq6ubg/image/upload/v1747887098/Standard_Collection_8_km1vpb.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="website-name">Insta Share</h1>

          <label className="label" htmlFor="username">
            USERNAME
          </label>
          <input
            placeholder="Username"
            className="input"
            id="username"
            type="text"
            value={username}
            onChange={this.onUsername}
          />
          <label className="label" htmlFor="password">
            PASSWORD
          </label>
          <input
            placeholder="Password"
            className="input"
            id="password"
            type="password"
            value={password}
            onChange={this.onPassword}
          />
          <button className="submit" type="submit">
            Login
          </button>
          {isError && <p className="error-text">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
