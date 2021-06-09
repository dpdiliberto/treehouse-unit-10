import React from 'react';

import { Link } from 'react-router-dom';

export default function Course (props) {
    const {
        title,
        id
     } = props;

    return (
        <div>
            <Link to={`/courses/${id}`} className="course--module course--link" style={ {height: '90%'}}>
                <h2 className="course--label">Course</h2>
                <h3 className="course--title">{title}</h3>
            </Link>
        </div>
    )
};