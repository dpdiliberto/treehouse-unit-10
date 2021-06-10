import React, { Component } from 'react';
import APIHandler from './APIHandler';
import Cookies from 'js-cookie';

const Context = React.createContext();

export class Provider extends Component {

    // Instantiate authenticatedUser and authenticatedPassword state to pull from cookies
    // If a cookie does not exist with these values, then set state to null
    state = {
        authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
        authenticatedPassword: Cookies.getJSON('authenticatedPassword') || null
    }

    constructor() {
        super();
        this.apiHandler = new APIHandler();
    }

    render () {
        const { authenticatedUser, authenticatedPassword } = this.state;

        const value = {
            authenticatedUser,
            authenticatedPassword,
            apiHandler: this.apiHandler,
            actions: {
                signIn: this.signIn,
                signOut: this.signOut,
                validationErrorCheck: this.validationErrorCheck
            }
        };

        return (
            <Context.Provider value={value}>
                {this.props.children}
            </Context.Provider>
        );
    }

    // Function to sign a user in and sets user as a cookie
    // Requires a username and password parameter
    signIn = async (username, password) => {
        const user = await this.apiHandler.getUser(username, password);
        const encodedPassword = btoa(password);
        if (user !== null) {
            this.setState(() => {
                return {
                    authenticatedUser: user,
                    authenticatedPassword: encodedPassword
                }
            });
            // Set cookie
            Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1})
            Cookies.set('authenticatedPassword', JSON.stringify(encodedPassword), {expires: 1})
        }
        return user;
    }

    // Function to sign a user out and remove corresponding cookies
    signOut = () => {
        this.setState({ authenticatedUser: null, authenticatedPassword: null });
        Cookies.remove('authenticatedUser');
        Cookies.remove('authenticatedPassword');
    }

    // Function to return validation error elements if validation errors exist
    validationErrorCheck = (validationErrors) => {
        if (validationErrors.length > 0) {
            return (
                <div className="validation--errors">
                    <h3>Validation Errors</h3>
                    <ul>
                        {validationErrors}
                    </ul>
                </div>
            )
        }
    }
}

export const Consumer = Context.Consumer;

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default { Context };