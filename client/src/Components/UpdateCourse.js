import React, { useState, useContext } from 'react';

import { Link, useHistory } from 'react-router-dom';

import Context from '../Context';
import ValidationErrors from './ValidationErrors';

export default function UpdateCourse ({match, location}) {
    const context = useContext(Context.Context);
    const history = useHistory();
    let id = match.params.id;
    
    let courseData = location.state.courseData;
    const [title, setTitle] = useState(courseData.title);
    const [description, setDescription] = useState(courseData.description);
    const [time, setTime] = useState(courseData.estimatedTime);
    const [materials, setMaterials] = useState(courseData.materialsNeeded);
    const [errors, setErrors] = useState([]);

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

    const submit = (e) => {
        e.preventDefault();
        const body = {
            title,
            description,
            estimatedTime: time,
            materialsNeeded: materials
        };

        const username = context.authenticatedUser.emailAddress;
        const password = atob(context.authenticatedPassword);

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

    const cancel = (e) => {
        e.preventDefault();
        history.push('/courses');
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

                        <p>By Joe Smith</p>

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
                <Link to={`/courses/${id}`}>
                    <button className="button button-secondary" onClick={cancel}>Cancel</button>
                </Link>
            </form>
        </div>
    </main>
    )
}