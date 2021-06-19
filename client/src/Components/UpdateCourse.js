import React, { useEffect, useState, useContext } from 'react';

import { useHistory } from 'react-router-dom';

import Context from '../Context';
import ValidationErrors from './ValidationErrors';
import APIHandler from '../APIHandler';

export default function UpdateCourse ({match, location}) {
    // Instantiate context and history objects
    const context = useContext(Context.Context);
    const history = useHistory();
    let id = match.params.id;
    const username = context.authenticatedUser.emailAddress;
    const password = atob(context.authenticatedPassword);

    const apiHandler = new APIHandler();

    // useEffect to pull courses data once component has mounted
    // Update coursesData state with data that is pulled
    useEffect(() => {
        apiHandler.getCourse(id)
            .then(course => {
                if (course) {
                    setTitle(course.title);
                    setDescription(course.description);
                    setTime(course.time);
                    setMaterials(course.materials);
                    setCourseOwnerFirstName(course.User.firstName);
                    setCourseOwnerLastName(course.User.lastName);

                    if (username !== course.User.emailAddress) {
                        history.push('/forbidden');
                    }
                } else {
                    history.push('/notfound');
                }
            })
            .catch(err => {
                console.log('Error fetching and parsing data', err);
                history.push('/error');
            });
      }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Instantiate state for form elements and for errors
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [materials, setMaterials] = useState('');
    const [courseOwnerFirstName, setCourseOwnerFirstName] = useState('');
    const [courseOwnerLastName, setCourseOwnerLastName] = useState('');
    const [errors, setErrors] = useState([]);

    // Function to handle form text updates
    const change = (event) => {
        const value = event.target.value;
        if (event.target.name === 'courseTitle') {
            setTitle(value);
        } else if (event.target.name === 'courseDescription') {
            setDescription(value);
        } else if (event.target.name === 'estimatedTime') {
            setTime(value);
        } else if (event.target.name === 'materialsNeeded') {
            setMaterials(value);
        }
    }

    // Function to handle form submission
    // Updates a course or provides validation errors depending on the inputs
    // Links back to Courses homepage if successful
    const submit = (e) => {
        e.preventDefault();
        const body = {
            title,
            description,
            estimatedTime: time,
            materialsNeeded: materials
        };

        //const username = context.authenticatedUser.emailAddress;
        //const password = atob(context.authenticatedPassword);

        context.apiHandler.updateCourse(id, body, username, password)
            .then( errs => {
                if(errs.length) {
                    console.log(errs);
                    setErrors(errs);
                    setErrors(err => 
                        err.map((err, index) => 
                            <ValidationErrors error={err} key={index}/>
                        )
                    )
                } else {
                    history.push('/courses');
                };
            })
            .catch((err) => {
                console.log(err);
                history.push('/error');
            })
    }

    // Function when "Cancel" button is clicked to return user to homepage
    const cancel = (e) => {
        e.preventDefault();
        history.push(`/courses/${id}`);
    }

    return (
        <main>
          <div className="wrap">
                <h2>Update Course</h2>
                {context.actions.validationErrorCheck(errors)}
                <form onSubmit={submit}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input id="courseTitle" name="courseTitle" type="text" value={title} onChange={change}/>

                            <p>By {courseOwnerFirstName} {courseOwnerLastName}</p>

                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea id="courseDescription" name="courseDescription" onChange={change} value={description}></textarea>
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" value={time || ''} onChange={change}/>

                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded" onChange={change} value={materials || ''}></textarea>
                        </div>
                    </div>
                    <button className="button" type="submit">Update Course</button>
                    <button className="button button-secondary" onClick={cancel}>Cancel</button>
                </form>
            </div> 
        </main>
    )
}