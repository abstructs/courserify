/* tslint:disable */

import * as React from 'react';

// import { CardHeader, CardActions, Collapse, Card, Button, IconButton, Avatar, Dialog, DialogTitle, DialogActions, LinearProgress, DialogContent, TextField, DialogContentText, withStyles } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import PeopleIcon from '@material-ui/icons/SupervisorAccount';
import PersonIcon from '@material-ui/icons/Person';
// import CourseEditContent from './CourseEditContent';

import CourseInfoContent from './CourseInfoContent';

// import RecommendationDialog from '../Recommendation/RecommendationDialog';
import { ICourse, IEditCourseForm, IImage } from 'src/Services/CourseService';
// Collapse
import { Card, Dialog, DialogTitle, DialogActions, Button, DialogContent, DialogContentText, TextField, CardHeader, Avatar, CardActions, withStyles, IconButton, Collapse, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import CourseEditContent from './CourseEditExpansion';
import { ICurrentUser } from 'src/Services/UserService';
import { Variant } from 'src/Helpers/AppSnackbar';
import { blue } from '@material-ui/core/colors';

const styles = {
    card: {
        // maxWidth: 800,
        marginBottom: "40px"
    },
    actions: {
        display: 'flex',
    },
    userAvatar: {
        backgroundColor: blue[100],
        color: blue[600],
    }
}

interface IPropTypes {
    course: ICourse,
    currentUser: ICurrentUser | null,
    showSnackbar: (message: string, variant: Variant) => void,
    unrecommendCourse: (courseId: number, onSuccess: () => void, onError: () => void) => void,
    recommendCourse: (courseId: number, onSuccess: () => void, onError: () => void) => void,
    updateCourse: (form: IEditCourseForm, onSuccess: () => void, onError: () => void) => void,
    deleteCourse: (courseId: number, onSuccess: () => void, onError: () => void) => void,
    deleteImage: (courseId: number, onSuccess: () => void, onError: () => void) => void,
    getCourse: (courseId: number, onSuccess: (course: ICourse) => void, onError: () => void) => void,
    classes: {
        card: string,
        avatar: string,
        userAvatar: string,
        actions: string
    }
}

interface IStateTypes {
    course: ICourse,
    deleteDialogOpen: boolean,
    edit: boolean,
    loading: boolean,
    editFormExpanded: boolean,
    deleted: boolean,
    openRecommendations: boolean,
    openShare: boolean
}

const defaultImageState: IImage = {
    fileName: "",
    imageUrl: "",
    file: null
}

class CourseCard extends React.Component<IPropTypes, IStateTypes> {
    constructor(props: IPropTypes) {
        super(props);

        this.state = {
            deleteDialogOpen: false,
            editFormExpanded: false,
            edit: false,
            loading: false,
            deleted: false,
            course: props.course,
            openRecommendations: false,
            openShare: false
        }
    }

    expandEditForm() {
        this.setState({ editFormExpanded: true });
    }

    toggleEditFormExpand() {
        this.setState({ editFormExpanded: !this.state.editFormExpanded });
    }

    closeEditForm() {
        this.setState({ 
            editFormExpanded: false
        });
    }

    openDeleteDialog() {
        this.setState({ deleteDialogOpen: true });
    }

    deleteCourse() {
        this.props.deleteCourse(this.state.course.id, () => {
            this.setState({ deleted: true });
            this.props.showSnackbar("Course has been deleted", Variant.Success);
        }, () => {
            this.props.showSnackbar("Something went wrong", Variant.Error);
        });

        console.log("delete");
        // axios.delete(`${process.env.REACT_APP_API_URL}/api/v1/courses/${this.state.course.id}`)
        // .then(res => {
        //     this.setState({ refreshing: true, deleteDialogOpen: false }, _ => setTimeout(_ => {
        //         this.setState({ deleted: true })
        //         this.props.showSnackbar("Successfully deleted course", "success");
        //     }, 1000));
        // });
    }

    handleDeleteCancel() {
        this.setState({ deleteDialogOpen: false });
    }

    handleEditCancel() {
        console.log("Cancel edit")

        this.setState({
            course: {
                ...this.props.course,
                image: defaultImageState
            }
        }, this.closeEditForm);
    }

    handleOpenDialog() {
        this.setState({ deleteDialogOpen: true });
    }

    refresh() {
        this.props.getCourse(this.state.course.id, (course: ICourse) => {
            this.setState({
                course: {
                    ...course
                }
            })
        }, () => {

        });
    }

    openRecommendationsDialog() {
        this.setState({ openRecommendations: true });
    }

    closeRecommendationsDialog() {
        this.setState({ openRecommendations: false });
    }
    
    setImageUrl(image_url: string | null) {
        this.setState({
            course: {
                ...this.state.course,
                image_url
            }
        });
    }

    setImage(file: File | null) {
        
        this.setState({
            course: {
                ...this.state.course,
                image: {
                    imageUrl: file ? URL.createObjectURL(file) : "",
                    fileName: file ? file.name : "",
                    file
                }
            }
        });
    }

    openShareDialog() {
        this.setState({ openShare: true });
    }

    closeShareDialog() {
        this.setState({ openShare: false });
    }

    handleCopy() {
        const copied = document.execCommand('copy');

        if(copied) {
            this.closeShareDialog();
        }
    }

    onEditSuccess(form: IEditCourseForm) {
        this.setState({
            course: { 
                ...this.state.course,
                ...form
            }
        }, this.closeEditForm);
    }

    // unrecommend() {
    //     this.props.unrecommendCourse(this.state.course.id, () => this.refresh(), () => this.refresh());
    // }

    // recommend() {
    //     this.props.recommendCourse(this.state.course.id, () => this.refresh(), () => this.refresh());
    // }

    handleRecommend() {
        if(this.state.course.current_user_recommended) {
            this.props.unrecommendCourse(this.state.course.id, () => this.refresh(), () => this.refresh());
        } else {
            this.props.recommendCourse(this.state.course.id, () => this.refresh(), () => this.refresh());
        }
    }

    // setImageUrl(new_url) {
    //     console.log("set url called")
    //     this.setState(prevState => ({
    //         // ...prevState,
    //         course: {
    //             ...prevState.course,
    //             image_url: new_url
    //         }
    //     })); 
    // }
 
    render() {
        const { classes, currentUser } = this.props;
        const { course, deleted, editFormExpanded, deleteDialogOpen, openShare, openRecommendations } = this.state;

        if(deleted) {
            return (
                <div>
                </div>
            );
        }

        return (
            <Card className={classes.card}>
                {/* <SimpleSnackbar message={"hi"} /> */}

                {/* <RecommendationDialog recommendations={course.recommendations} onClose={() => this.closeRecommendationsDialog()} course_id={course.id} open={this.state.openRecommendations} /> */}
                <Dialog onClose={() => this.closeRecommendationsDialog()} open={openRecommendations}>
                <DialogTitle id="simple-dialog-title">People Who Recommended This Course</DialogTitle>
                <div>
                    <List>
                    {course.recommendations.map(recommendation => (
                        <ListItem key={recommendation.id}>
                            <ListItemAvatar>
                                <Avatar className={`${classes.userAvatar}`}>
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={recommendation.user.username} />
                            <Button href={`/profile/${recommendation.user.username}`}>View Profile</Button>
                        </ListItem>
                    ))}
                    </List>
                </div>
            </Dialog>

                <Dialog open={deleteDialogOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Are you sure you want to remove this course?"}</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => this.deleteCourse()} color="primary" autoFocus>
                            Yes, remove it
                        </Button>
                        <Button onClick={() => this.handleDeleteCancel()}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    style={{minWidth: "400px"}}
                    open={openShare}
                    onClose={() => this.closeShareDialog()}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Share this course with a friend</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Copy the link below
                        </DialogContentText>
                        <TextField
                        autoFocus
                        // onFocus={() => this.handleShareFocus()}
                        margin="normal"
                        id="link"
                        value={`/courses/${course.id}`}
                        label="Copy Link"
                        type="text"
                        fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.closeShareDialog()} color="primary">
                            Close
                        </Button>
                        <Button onClick={this.handleCopy.bind(this)} color="primary">
                            Copy Link
                        </Button>
                    </DialogActions>
                </Dialog>
                <CardHeader
                    // style={{paddingBottom: "0px"}}
                    avatar={
                    <Avatar aria-label="Recipe" className={classes.avatar}>
                        <DoneIcon color="primary" />
                    </Avatar>}
                    // }
                    // action={
                    // <IconButton>
                    //     <MoreVertIcon />
                    // </IconButton>
                    // }
                    title={`${course.title} - (${course.category.split("_").map(word => word[0].toUpperCase() + word.slice(1)).join(" ")})`}
                    subheader={`by ${course.author}`}
                />

                <CourseInfoContent course={this.state.course} />

                <CardActions className={classes.actions} disableActionSpacing>
                    <IconButton color={course.current_user_recommended ? "secondary" : "default"} 
                        onClick={() => this.handleRecommend()}
                        aria-label="Recommend this course"
                        //disabled={refreshing}
                    >
                        <FavoriteIcon 
                            
                        />
                    </IconButton>
                        {/*  */}
                    <IconButton onClick={() => this.openShareDialog()} aria-label="Share">
                        <ShareIcon color={openShare ? "secondary" : "inherit"} />
                    </IconButton>
                    <IconButton onClick={() => this.openRecommendationsDialog()}  aria-label="Delete">
                        <PeopleIcon color={this.state.openRecommendations ? "secondary" : "inherit"} />
                    </IconButton>
                    {
                        currentUser && currentUser.id === course.user_id &&   
                        <div>
                            <IconButton onClick={() => this.toggleEditFormExpand()} aria-label="Edit">
                                <EditIcon color={editFormExpanded ? "secondary" : "inherit"} />
                            </IconButton>
                            <IconButton onClick={() => this.openDeleteDialog()}  aria-label="Delete">
                                <DeleteIcon color={deleteDialogOpen ? "secondary" : "inherit"} />
                            </IconButton>
                        </div>
                    }
                </CardActions>
                {/* {refreshing && <LinearProgress />} */}

                <Collapse in={editFormExpanded} timeout="auto">
                    {/* setImageUrl={this.setImageUrl.bind(this)}  */}
                    {/* handleEditError={this.handleEditError.bind(this)} handleEditLoading={this.handleEditLoading.bind(this)} handleEditSuccess={this.handleEditSuccess.bind(this)} handleEditExpand={this.handleEditExpand.bind(this)}  */}
                    <CourseEditContent setImageUrl={(image_url: string) => this.setImageUrl(image_url)} deleteImage={this.props.deleteImage} setImage={(file: File) => this.setImage(file)} showSnackbar={this.props.showSnackbar} onSuccess={(newCourse: IEditCourseForm) => this.onEditSuccess(newCourse)} updateCourse={this.props.updateCourse} handleCancel={() => this.handleEditCancel()}  course={course} />
                </Collapse>
            </Card>
        );
    }
}

export default withStyles(styles)(CourseCard);