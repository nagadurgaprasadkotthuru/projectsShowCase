import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from './components/Header'
import Project from './components/Project'

import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    activeOption: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeOption} = this.state
    const requestUrl = `https://apis.ccbp.in/ps/projects?category=${activeOption}`
    const response = await fetch(requestUrl)
    if (response.ok) {
      const data = await response.json()
      const {projects} = data
      const formattedProjectsList = projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      console.log(formattedProjectsList)
      this.setState({
        projectsList: formattedProjectsList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeOption = event => {
    this.setState({activeOption: event.target.value}, this.getProjectsList)
  }

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <div className="list-container">
        <ul className="projects-list">
          {projectsList.map(eachProject => (
            <Project projectDetails={eachProject} key={eachProject.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        className="failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.getProjectsList}
      >
        Retry
      </button>
    </div>
  )

  renderSwitchView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {activeOption} = this.state
    return (
      <div className="app-bg-container">
        <Header />
        <div className="container">
          <select
            className="select-options"
            onChange={this.onChangeOption}
            value={activeOption}
          >
            {categoriesList.map(eachCategory => (
              <option
                className="option"
                value={eachCategory.id}
                key={eachCategory.id}
              >
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          {this.renderSwitchView()}
        </div>
      </div>
    )
  }
}

export default App
