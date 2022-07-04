import './cardpost.css'
import React from 'react';
import DOMPurify from 'dompurify';
import { Link } from "react-router-dom";

function CardPost(props) {
    // 1. Get the picture from local folder
    const publicFolderPath = "https://myblogs3bucket.s3.us-east-2.amazonaws.com/"

    // 2. create category JSX array
    const catJSXElements = props.post.categories.map(cat => {
        return (
            <span key={cat} className="postCat">
                {cat}
            </span>
        )
    })

    return (

        <Link className="link" to={`/blogposts/${props.post._id}`}>
            <div className="post box">
                <img
                    className="postImg"
                    
                    src={publicFolderPath+props.post.picture}
                    alt="blog cover"
                />

                <div className="postInfo">
                    <span className="postTitle">{props.post.title}</span>
                </div>
                
                <p className="postDesc">
                    <div dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                            props.post.content,
                            {FORCE_BODY: true})}}>
                    </div>
                </p>

                <div className="postCats">
                    {catJSXElements}
                </div>
            </div>
        </Link>

    )
}

export default CardPost