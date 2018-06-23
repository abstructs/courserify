import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import Auth from '../Auth';
import { Redirect, matchPath } from 'react-router';
// import $ from 'jquery';
import PropTypes from 'prop-types';

import ProfileInfoContent from './ProfileInfoContent';
import ProfileEditContent from './ProfileEditContent';
import ProfileFollowerContent from './ProfileFollowerContent';
import ProfileFollowingContent from './ProfileFollowingContent';
import { Grid, withStyles, Card, AppBar, Tabs, Tab, List, ListItem, ListItemIcon, ListItemText, Divider, LinearProgress } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

axios.defaults.headers.common['Authorization'] = Auth().headers()['Authorization'];

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: "25%",
    },
    media: {
        height: 0,
        // paddingTop: '56.25%', // 16:9
        paddingTop: '30%', // 16:9
        // maxHeight: "200px"
    },
    cardContent: {
        // width: "500px"
    }
});

class ProfileContainer extends Component {
    constructor(props) {
        super(props);

        const parsedJwt = Auth().paraseJwt();

        this.state = {
            current_user_id: parsedJwt ? parsedJwt.sub.user.id : -1,
            is_current_user_profile: false,
            edit: false,

            // tab logic
            tab: 0,

            // user info
            profile_info: {},

            loading: true
        }
    }

    // EFFECTS: Gets the parameters from the url react router style
    getMatch() {
        return matchPath(this.props.history.location.pathname, {
            path: '/people/:id',
            exact: true,
            strict: false
        });
    }

    componentWillMount() {
        this.refreshUserInfo();
    }

    incrementRecommendations(num) {
        this.setState(prevState => ({
            profile_info: {
                ...prevState.profile_info,
                recommendationsCount: this.state.profile_info.recommendationsCount + num
            }
        }));
    }

    toggleCurrentUserIsFollowing() {
        this.setState(prevState => ({
            profile_info: {
                ...prevState.profile_info,
                current_user_is_following: !this.state.profile_info.current_user_is_following
            }
        }))
    }

    incrementFollowers(num) {
        this.setState(prevState => ({
            profile_info: {
                ...prevState.profile_info,
                followerCount: this.state.profile_info.followerCount + num
            }
        }));
    }

    // EFFECTS: Manages the data set on the profile page depending on if it's the current users profile or another user's
    refreshUserInfo() {
        const url = this.getMatch() ? "http://localhost:3000/api/v1/users/" + this.getMatch().params.id : 
                                      "http://localhost:3000/api/v1/profile";
        axios.get(url)
        .then(res => {
            const profile_info = res.data.user;
            const new_profile_info = profile_info.is_current_user_profile ? profile_info : [];
            this.setState({ profile_info, new_profile_info, edit: false, loading: false });
        })
        .catch(err => {
            console.log(err);
        });
    }

    toggleEdit() {
        this.setState({ edit: !this.state.edit });
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
            },
            loading: true
        })); 
    }

    handleTab(e, tab) {
        this.setState({ tab });
    }

    render() {
        const isLoggedIn = Auth().isAuthenticated();
        const { classes } = this.props;
        const { profile_info, loading } = this.state;
        
        if(!isLoggedIn && !this.getMatch()) {
            return <Redirect to='/'/>;
        }

        // if(Object.keys(this.state.profile_info).length == 0) {
        //     return <div>Loading</div>;
        // 

        return (
            <div className={classes.root}>
                <Grid container spacing={0}>
                    <Grid item xl={3}>
                        <List component="nav">
                            <ListItem button >
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItem>
                            <Divider />
                            <ListItem button >
                                <ListItemIcon>
                                    <LibraryBooksIcon />
                                </ListItemIcon>
                                <ListItemText primary={`Recommendations`} />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={8}>
                        <Card style={{margin: "50px"}} className={classes.card}>
                            
                            <AppBar position="static">
                                <Tabs value={this.state.tab} onChange={this.handleTab.bind(this)}>
                                    <Tab value={0} label="Info" />
                                    <Tab value={1} label={`Following (${!loading && profile_info.followingCount || 0})`} />
                                    <Tab value={2} label={`Followers (${!loading && profile_info.followerCount || 0})`} />
                                </Tabs>
                            </AppBar>
                            {(() => {
                                if(!loading) {
                                    switch(this.state.tab) {
                                        case 0:
                                            return !this.state.edit 
                                            ? <ProfileInfoContent toggleEdit={this.toggleEdit.bind(this)} toggleCurrentUserIsFollowing={this.toggleCurrentUserIsFollowing.bind(this)} incrementFollowers={this.incrementFollowers.bind(this)}  profile={profile_info} classes={classes} /> 
                                            : <ProfileEditContent refreshUserInfo={this.refreshUserInfo.bind(this)} profile={profile_info} classes={classes} toggleEdit={this.toggleEdit.bind(this)} />;
                                        case 1:
                                            return <ProfileFollowingContent profile={profile_info} classes={classes} />;
                                        case 2:
                                            return <ProfileFollowerContent profile={profile_info} classes={classes} />;
                                    }
                                }
                            })()}
                            {loading && <LinearProgress />}
                        </Card>
                        
                    </Grid>
                    
                </Grid>
            </div>
        );
    }
}

ProfileContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfileContainer);