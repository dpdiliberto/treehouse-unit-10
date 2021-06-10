import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Context from '../Context';

export default function UserSignUp () {

    // Instantiate context and history objects
    const context = useContext(Context.Context);
    let history = useHistory();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const change = (e) => {
        const value = e.target.value;
        if (e.target.name === 'emailAddress') {
            setEmailAddress(value);
        } else if (e.target.name === 'password') {
            setPassword(value);
        } 
    }

    const submit = (e) => {
        // Create user
        const user = {
            emailAddress,
            password
        };
        e.preventDefault();

        context.apiHandler.getUser(user.emailAddress, user.password)
            .then( errs => {
                if(errs.length) {
                    console.log(errs);
                    setErrors(errs);
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

    const cancel = (e) => {
        e.preventDefault();
        history.push('/courses');
    }

    return (
        <main>
            <div className="form--centered">
                <h2>Sign In</h2>
                {context.actions.validationErrorCheck(errors)}
                <form onSubmit={submit}>
                    <label htmlFor="emailAddress">Email Address</label>
                    <input id="emailAddress" name="emailAddress" type="email" value={emailAddress} onChange={change}/>
                    <label htmlFor="password">Password</label>
                    <input id="password" name="password" type="password" value={password} onChange={change}/>
                    <button className="button" type="submit">Sign In</button><button className="button button-secondary" onClick={cancel}>Cancel</button>
                </form>
                <p>Don't have a user account? Click here to <Link to={'/signup'}>sign up</Link>!</p>
                
            </div>
        </main>
    )
}