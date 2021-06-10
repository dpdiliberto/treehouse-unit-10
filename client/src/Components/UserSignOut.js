import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Context from '../Context';

export default function UserSignOut() {

    // Calls signOut function from context to sign user out
    const context = useContext(Context.Context);
    context.actions.signOut();

  return (
    <Redirect to="/courses" />
  );
}