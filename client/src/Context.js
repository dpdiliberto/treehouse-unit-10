import React, { Component } from 'react';
import APIHandler from './APIHandler';
import Cookies from 'js-cookie';

const Context = React.createContext();

export class Provider extends Component {

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

    signOut = () => {
        this.setState({ authenticatedUser: null, authenticatedPassword: null });
        Cookies.remove('authenticatedUser');
        Cookies.remove('authenticatedPassword');
    }

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