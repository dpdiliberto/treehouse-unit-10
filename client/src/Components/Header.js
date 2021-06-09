import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Context from '../Context';

export default function Header () {
    const context = useContext(Context.Context);
    let firstName;
    if (context.authenticatedUser) {
        firstName = context.authenticatedUser.firstName;
    }

    const signOut = () => {
        context.actions.signOut();
        return (<Redirect to="/courses" />)
      }
    return (
        <header>
            <div className="wrap header--flex">
                <h1 className="header--logo"><Link to={'/courses'}>Courses</Link></h1>
                <nav>
                    {
                        context.authenticatedUser 
                        ? 
                        (
                        <ul className="header--signedout">
                            <li>Welcome, {firstName}!</li>
                            <li><Link to={'/courses'} onClick={signOut}>Sign Out</Link></li>
                        </ul>)
                        : 
                        (<ul className="header--signedout">
                            <li><Link to={'/signup'}>Sign Up</Link></li>
                            <li><Link to={'/signin'}>Sign In</Link></li>
                        </ul>)
                    }
                </nav>
            </div>
        </header>
    )
}