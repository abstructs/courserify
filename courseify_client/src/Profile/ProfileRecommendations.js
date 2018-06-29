import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import Auth from '../Auth';
import RecommendationCard from '../Recommendation/RecommendationCard';
import CourseCard from '../Course/CourseCard';
// import { Redirect, matchPath } from 'react-router';
// import teacherImage from './images/laptop.jpeg';
// import $ from 'jquery';
// import swal from 'sweetalert';

{/* <button type="button" className="text-light nav-link btn" style={{width: "250px", backgroundColor: "#ff6000"}} data-toggle="modal" data-target="#recommendModal"> */}

axios.defaults.headers.common['Authorization'] = Auth().headers()['Authorization'];

class ProfileRecommendations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            recommendations: []
        }
    }

    componentWillMount() {
        axios.get(`http://localhost:3000/api/v1/recommendations?user_id=${this.props.profile.id}`)
        .then(res => {
            const recommendations = JSON.parse(res.data.recommendations);
            this.setState({ recommendations });

        //   console.log(this.props.profile_info);
        //   console.log(recommendations);
          
        //   this.setState({ recommendations });          
        })
    }

    render() {
        return (
            <div className="card-group justify-content-center">
                {this.state.recommendations.map(recommendation => {
                    const course = recommendation.course;
                    return <CourseCard course={course} />
                })}
            </div>
        );
    }
}

export default ProfileRecommendations;