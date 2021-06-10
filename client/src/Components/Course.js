import React from 'react';

import { Link } from 'react-router-dom';

export default function Course (props) {

    // Instantiate title and id variables from props 
    const {
        title,
        id
     } = props;

    return (
        <div>
            <Link to={`/courses/${id}`} className="course--module course--link">
                <h2 className="course--label">Course</h2>
                <h3 className="course--title">{title}</h3>
            </Link>
        </div>
    )
};