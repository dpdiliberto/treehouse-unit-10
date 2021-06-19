import React, { useState, useEffect, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import APIHandler from '../APIHandler';

import { Link, useHistory } from 'react-router-dom';

import Context from '../Context';

export default function CourseDetail ({match}) {
    // Instantiate context and history objects
    const context = useContext(Context.Context);
    let history = useHistory();

    // Instantiate state for form elements and for errors
    const [courseData, setCourseData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    let id = match.params.id;

    const apiHandler = new APIHandler();

    // useEffect to pull courses data once component has mounted
    // Update coursesData state with data that is pulled
    useEffect(() => {
        let mounted = true;
        apiHandler.getCourse(id)
            .then(course => {
                if (mounted) {
                    if (course) {
                        setCourseData(course)
                    } else {
                        history.push('/notfound');
                    }
                }
            })
            .catch(err => {
                console.log('Error fetching and parsing data', err);
                history.push('/error');
            })
            .finally(() => setIsLoading(false));

        return () => mounted = false;
      }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Function to delete a course if a user is authenticated
    const onDelete = (e) => {
        e.preventDefault();

        const username = context.authenticatedUser.emailAddress;
        const password = atob(context.authenticatedPassword);
        context.apiHandler.deleteCourse(id, username, password)
            .then(() => {
                history.push('/');
            })
            .catch((err) => {
                console.log(err);
                history.push('/error');
            })
    }

    // Function to create course detail elements depending on if a user is authenticated
    // If the page has loaded, the user is authenticated, and the username of the course creator is the same as the authenticated user's, then the user can select "Update Course", "Delete Course", or "Return to List"
    // If a page has loaded and the user is not authenticated or is not the owner of a course, then they are only able to select "Return to List"
    const authenticatedUserPermissions = () => {
        if (!isLoading && context.authenticatedUser && courseData.User.emailAddress === context.authenticatedUser.emailAddress) {
                return (<div className="wrap">
                <Link to={{
                pathname:`/courses/${id}/update`,
                state: { courseData }

                }}>
                    <button className="button">Update Course</button>
                </Link>
                <Link to={`/courses`}>
                    <button className="button" onClick={onDelete}>Delete Course</button>
                </Link>
                <Link to={`/courses`}>
                    <button className="button button-secondary">Return to List</button>
                </Link>
            </div>)
        } else {
            return (
                <div className="wrap">
                    <Link to={`/courses`}>
                        <button className="button button-secondary">Return to List</button>
                    </Link>
                </div>)
        } 
    }

    return (
        <main>
            <div className="actions--bar">
                {authenticatedUserPermissions()}
            </div>
            {
                isLoading
                ? <p></p>
                :  
                (<div className="wrap">
                    <h2>Course Detail</h2>
                    <form>
                        <div className="main--flex">
                            <div>
                                <h3 className="course--detail--title">Course</h3>
                                <h4 className="course--name">{courseData.title}</h4>
                                <p>By {courseData.User.firstName} {courseData.User.lastName}</p>

                                <ReactMarkdown>{courseData.description}</ReactMarkdown>
                            </div>
                            <div>
                                <h3 className="course--detail--title">Estimated Time</h3>
                                {
                                    courseData.estimatedTime 
                                    ? 
                                    <p>{courseData.estimatedTime}</p>
                                    :
                                    <p>N/A</p>
                                }
                                <h3 className="course--detail--title">Materials Needed</h3>
                                {
                                    courseData.materialsNeeded
                                    ?
                                    (<div className="course--detail--list">
                                        <ReactMarkdown>{courseData.materialsNeeded}</ReactMarkdown>
                                    </div>)
                                    :
                                    <p>N/A</p>
                                }
                            </div>
                        </div>
                    </form>
                </div>)
            }
        </main>
    )
}