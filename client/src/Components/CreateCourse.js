import React, { useState, useContext } from 'react';

import { useHistory } from 'react-router-dom';
import ValidationErrors from './ValidationErrors';
import Context from '../Context';

export default function CreateCourse ({match, location}) {
    const context = useContext(Context.Context);
    const history = useHistory();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [time, setTime] = useState('');
    const [materials, setMaterials] = useState('');
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

    const submit = (event) => {
        event.preventDefault();
        const userId = context.authenticatedUser.id;
        const username = context.authenticatedUser.emailAddress;
        const password = atob(context.authenticatedPassword);

        const body = {
            title,
            description,
            userId
        };
        if (time) {
            body.estimatedTime = time;
        }
        if (materials) {
            body.materialsNeeded = materials;
        }
        context.apiHandler.createCourse(body, username, password)
            .then( errs => {
                if(errs.length) {
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
                <h2>Create Course</h2>
                {context.actions.validationErrorCheck(errors)}
                <form onSubmit={submit}>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="courseTitle">Course Title</label>
                            <input id="courseTitle" name="courseTitle" type="text" onChange={change} value={title}/>

                            <p>By {context.authenticatedUser.firstName} {context.authenticatedUser.lastName}</p>

                            <label htmlFor="courseDescription">Course Description</label>
                            <textarea id="courseDescription" name="courseDescription" onChange={change} value={description}></textarea>
                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                            <input id="estimatedTime" name="estimatedTime" type="text" onChange={change} value={time}/>

                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea id="materialsNeeded" name="materialsNeeded"onChange={change} value={materials}></textarea>
                        </div>
                    </div>
                    <button className="button" type="submit">Create Course</button><button className="button button-secondary" onClick={cancel}>Cancel</button>
                </form>
            </div>
        </main>
    )
}