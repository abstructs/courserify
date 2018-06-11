import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Auth from './Auth';
import { Redirect, matchPath } from 'react-router';
import teacherImage from './images/laptop.jpeg';

axios.defaults.headers.common['Authorization'] = Auth().headers()['Authorization'];

class ProfileRecommendation extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    render() {
        return (
            <div>Recommendations</div>
        );
    }
}

class ProfileFollowing extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        
    }

    render() {
        return (
            <div>Following</div>
        );
    }
}

class ProfileFollowers extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        
    }

    render() {
        return (
            <div>Followers</div>
        );
    }
}

class ProfileEdit extends Component {
    constructor(props) {
        super(props);        
    }

    render() {
        return (
            <div className="">
                <form>
                    <div className="form-row mb-4">
                        <div className="col-md-4">
                            <label for="first_name">First name</label>
                            <input onChange={this.props.handleUserInfoChange} value={this.props.new_user_info.first_name} type="text" className="form-control" name="first_name" placeholder="First Name" required />
                        </div>
                            
                        <div className="col-md-4">
                            <label for="last_name">Last Name</label>
                            <input onChange={this.props.handleUserInfoChange} value={this.props.new_user_info.last_name} type="text" className="form-control" name="last_name" placeholder="Last Name" required />
                        </div>

                        <div className="col-md-4">
                            <label for="headline">Headline</label>
                            <input onChange={this.props.handleUserInfoChange} value={this.props.new_user_info.headline} type="text" className="form-control" name="headline" placeholder="Job Title" required />
                        </div> 
                    </div>

                    <div className="form-row mb-4">
                        <div className="col-md-6">
                            <label for="country">Country</label>
                            <input onChange={this.props.handleUserInfoChange} value={this.props.new_user_info.country} type="text" className="form-control" name="country" placeholder="Country" required />
                        </div>
                                
                        <div className="col-md-6">
                            <label for="education">Education</label>
                            <input onChange={this.props.handleUserInfoChange} value={this.props.new_user_info.education} type="text" className="form-control" name="education" placeholder="Education" required />
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <div className="col-md-12">
                            <label for="industry">Industry</label>
                            <input onChange={this.props.handleUserInfoChange} value={this.props.new_user_info.industry} type="text" className="form-control" name="industry" placeholder="Industry" required />
                        </div>
                    </div>

                    <div className="form-row mb-4">
                        <div className="col-md-12">
                            <label for="summary">Summary</label>
                            <textarea onChange={this.props.handleUserInfoChange} value={this.props.new_user_info.summary} className="form-control" name="summary" placeholder="Summary" required />
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

class ProfileInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {/* <h2 className="text-light font-weight-light p-auto">Andrew Wilson</h2> */}
                {/* <div className="text-center "> */}
                    {/* <p className="d-inline pr-3"><b>0</b> recommendations</p>
                    <p className="d-inline pr-3"><b>0</b> followers</p>
                    <p className="d-inline pr-3"><b>0</b> following</p> */}
                {/* </div> */}
                {/* <br/>
                <br/> */}
                <p className=""><b><i>{this.props.user_info.headline}</i></b> in <b><i>{this.props.user_info.country}</i></b>.</p>
                <p>Involved in <b><i>{this.props.user_info.industry}</i></b>.</p>
                <p className="">Attended <b><i>{this.props.user_info.education}</i></b>.</p>
                <p className="" style={{whiteSpace: "pre-wrap"}}><i>{this.props.user_info.summary}</i></p>
            </div>
        );
    }
}

class Profile extends Component {
    constructor(props) {
        super(props);

        // const is_profile = 
        const parsedJwt = Auth().paraseJwt();

        this.state = {
            current_user_id: parsedJwt ? parsedJwt.sub.user.id : -1,
            is_current_user_profile: false,
            edit: false,
            save: false,

            // tab logic
            tab: "info",
            // for profile edit
            new_profile_info: {},

            // user info
            profile_info: {}
        }
    }

    getMatch() {
        // this.setState({ 
        //     is_profile: (this.getMatch() ? this.getMatch().params.id == )
        // })

        return matchPath(this.props.history.location.pathname, {
            path: '/people/:id',
            exact: true,
            strict: false
        });
    }

    componentWillMount() {
        this.setUserInfo();
    }

    // EFFECTS: Manages the data set on the profile page depending on if it's the current users profile or another user's
    setUserInfo() {
        const url = this.getMatch() ? "http://localhost:3000/api/v1/users/" + this.getMatch().params.id : 
                                      "http://localhost:3000/api/v1/profile";

        // const data = this.getMatch() ? {} : { headers: Auth().headers() };
        axios.get(url)
        .then(res => {
            const profile_info = res.data.user;
            const is_current_user_profile = res.data.user.id === this.state.current_user_id;
            const new_profile_info = is_current_user_profile ? profile_info : [];

            this.setState({ profile_info, new_profile_info, is_current_user_profile });
        })
        .catch(err => {
            console.log(err);
        });
    }

    handleUserInfoChange(event) {  
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            // ...prevState,
            new_profile_info: {
                ...prevState.new_profile_info,
                [name]: value
            }
        })); 

        // console.log(this.state)
    }

    handleSave(e) {
        axios.put("http://localhost:3000/api/v1/users/" + this.state.current_user_id, this.state.new_profile_info)
        .then(res => {
            this.setUserInfo();
            this.setState({edit: !this.state.edit});
        })
        .catch(err => {} /* TODO: Error handling */);        
    }

    handleEdit(e) {
        this.setState({edit: !this.state.edit});
    }

    handleCancel(e) {
        this.setState({edit: false});
    }

    render() {
        const isLoggedIn = Auth().isAuthenticated();
        
        if(!isLoggedIn && !this.getMatch()) {
            return <Redirect to='/'/>;
        }

        if(Object.keys(this.state.profile_info).length == 0) {
            return <div>Loading</div>
        }

        const middleSection = this.state.edit ? <ProfileEdit new_user_info={this.state.new_profile_info} handleUserInfoChange={this.handleUserInfoChange.bind(this)} /> : <ProfileInfo user_info={this.state.profile_info}/>
    const editFunctions = !this.state.edit ? (this.state.tab == "info" ? <a href="#edit" className="btn m-2 text-white m-auto text-center" style={{width: "250px", backgroundColor: "#ff6000"}} onClick={this.handleEdit.bind(this)}>Edit</a> : <div></div>)
                                              :
                                                <div>
                                                    <a href="#save" className="btn text-white m-auto text-center" style={{width: "250px", backgroundColor: "#ff6000"}} onClick={this.handleSave.bind(this)}>Save</a>
                                                    <a href="#cancel" className="btn text-white m-2 text-center btn-primary" style={{width: "250px"}} onClick={this.handleCancel.bind(this)}>Cancel</a>
                                                </div>;
        const otherFunctions = <div>
                                {/* <div className="mb-2 text-center">
                                    <a href="#message" className="btn text-white m-auto text-center" style={{backgroundColor: "#ff6000", width: "250px"}}>Follow</a>
                                </div> */}
                                {/* <div className="mb-2 text-center">
                                    <a href="#message" className="btn btn-primary text-white m-auto text-center" style={{width: "250px"}}>Message</a>
                                </div> */}
                               </div>;

        const content = () => {
            switch(this.state.tab) {
                case "info":
                    return middleSection;
                case "recommendations":
                    return <ProfileRecommendation />;
                case "following":
                    return <ProfileFollowing />;
                case "followers":
                    return <ProfileFollowers />;
                default:
                    return <div>Something went wrong :(.</div>;
            }
        }

        return (
            <div>
                <header className="bg-dark border-0 pt-5" style={{marginBottom: "0px", height: "150px", backgroundImage: "url(" + teacherImage +")", backgroundPosition: "250px 660px"}}>
                    
                </header>
                <section>
                    <div className="row">
                        <div className="col-xl-4">
                            <div className="rounded-circle border border-white bg-dark ml-auto mr-auto p-auto text-center" style={{height: "150px", width: "150px", marginTop: "-70px"}}></div>   
                                <h2 className="text-dark text-center font-weight-light p-auto">{this.state.profile_info.first_name + " " + this.state.profile_info.last_name}</h2>
                                <div className="mb-2 mt-4 text-center">
                                {this.state.is_current_user_profile ? editFunctions : otherFunctions}
                            </div>

                        </div>  
                        <div className  ="col-xl-5 m-4 text-center text-justify">
                            <ul class="nav nav-tabs nav-fill mb-4">
                                <li class="nav-item">
                                    <a href="#" class={"nav-link " + (this.state.tab == "info" ? "active" : "")} onClick={() => {this.setState({tab: "info"})}}>Info</a>
                                </li>
                                <li class="nav-item">
                                    <a href="#" class={"nav-link " + (this.state.tab == "recommendations" ? "active" : "")} onClick={() => {this.setState({tab: "recommendations"})}}>Recommendations (0)</a>
                                </li>
                                <li class="nav-item">
                                    <a href="#" class={"nav-link " + (this.state.tab == "followers" ? "active" : "")} onClick={() => {this.setState({tab: "followers"})}}>Followers (0)</a>
                                </li>
                                <li class="nav-item">
                                    <a href="#" class={"nav-link " + (this.state.tab == "following" ? "active" : "")} onClick={() => {this.setState({tab: "following"})}}>Following (0)</a>
                                </li>
                            </ul>
                            {content()}
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default Profile;