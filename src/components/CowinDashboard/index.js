// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByGender from '../VaccinationByGender'

import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const categoriesValues = {
  pending: 'PENDING',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'IN_PROGRESS ',
}

class CowinDashboard extends Component {
  state = {
    fetchedData: {},
    displayStatus: categoriesValues.initial,
  }

  componentDidMount() {
    this.fetchedData()
  }

  fetchedData = async () => {
    this.setState({
      displayStatus: categoriesValues.inProgress,
    })
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)

    if (response.ok === true) {
      const data = await response.json()
      const convertData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachDayData => ({
          vaccineDate: eachDayData.vaccine_date,
          dose1: eachDayData.dose_1,
          dose2: eachDayData.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age.map(range => ({
          age: range.age,
          count: range.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(genderType => ({
          gender: genderType.gender,
          count: genderType.count,
        })),
      }

      this.setState({
        fetchedData: convertData,
        displayStatus: categoriesValues.success,
      })
    } else {
      this.setState({displayStatus: categoriesValues.failure})
    }
  }

  renderByCharts = () => {
    const {fetchedData} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationData={fetchedData.last7DaysVaccination}
        />
        <vaccinationByGender
          vaccinationByGenderData={fetchedData.vaccinationByGender}
        />
        <vaccinationByAge vaccinationByAgeData={fetchedData.vaccinationByAge} />
      </>
    )
  }

  loadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  failureView = () => {
    ;<div className="failure-view-container">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1 className="failure-view-text">Something went wrong</h1>
    </div>
  }

  switchCaseCheck = () => {
    const {displayStatus} = this.state

    switch (displayStatus) {
      case categoriesValues.success:
        return this.renderByCharts()
      case categoriesValues.inProgress:
        return this.loadingView()
      case categoriesValues.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="page-container">
        <div className="page-logo-container">
          <div className="chats-container">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <p className="logo-text">Co-WIN</p>
          </div>
          <h1 className="page-heading">CoWin Vaccination in India</h1>
          {this.switchCaseCheck()}
        </div>
      </div>
    )
  }
}
export default CowinDashboard
