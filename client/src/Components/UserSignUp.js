import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ValidationErrors from './ValidationErrors';
import Context from '../Context';

export default function UserSignUp () {
    // Instantiate context and history objects
    const context = useContext(Context.Context);
    let history = useHistory();

    // Instantiate state for form elements and for errors
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);

    // Function to handle form text updates
    const change = (e) => {
        const value = e.target.value;
        if (e.target.name === 'firstName') {
            setFirstName(value);
        } else if (e.target.name === 'lastName') {
            setLastName(value);
        } else if (e.target.name === 'emailAddress') {
            setEmailAddress(value);
        } else if (e.target.name === 'password') {
            setPassword(value);
        } else if (e.target.name === 'confirmPassword') {
            setConfirmPassword(value);
        }
    }

    // Function to handle form submission
    // Creates a user or provides validation errors depending on the inputs
    // Links back to Courses homepage if successful
    const submit = (e) => {
        // Create user
        const user = {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword
        };
        e.preventDefault();
///SET FULL FRONT END VALIDATIONS
        context.apiHandler.createUser(user, errors)
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
                    context.actions.signIn(emailAddress, password)
                        .then(() => {
                            history.push('/courses');
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                history.push('/error');
            })
    }

    // Function when "Cancel" button is clicked to return user to homepage
    const cancel = (e) => {
        e.preventDefault();
        history.push('/courses');
    }

    return (
        <main>
            <div className="form--centered">
                <h2>Sign Up</h2>
                {context.actions.validationErrorCheck(errors)}
                <form onSubmit={submit}>
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" type="text" value={firstName} onChange={change}/>
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" type="text" value={lastName} onChange={change}/>
                    <label htmlFor="emailAddress">Email Address</label>
                    <input id="emailAddress" name="emailAddress" type="email" value={emailAddress} onChange={change}/>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" value={password} onChange={change}/>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={change}/>
                    <button className="button" type="submit">Sign Up</button><Link to={`/courses`}><button className="button button-secondary" onClick={cancel}>Cancel</button></Link>
                </form>
                <p>Already have a user account? Click here to <Link to={'/signin'}>sign in</Link>!</p>
            </div>
        </main>
    )
}