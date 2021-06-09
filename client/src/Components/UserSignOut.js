import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Context from '../Context';

export default function UserSignOut() {
    const context = useContext(Context.Context);
    context.actions.signOut();

  return (
    <Redirect to="/courses" />
  );
}