import './cardpost.css'
import React from 'react';
import { Link } from "react-router-dom";


function CardPost(props) {
    // 1. Get the picture from local folder
    const awsS3Path = "https://myblogs3bucket.s3.us-east-2.amazonaws.com/"

    // 2. create category JSX array
    const catJSXElements = props.post.categories.map(category => {
        return (
            <span key={category} className="postCat">
                {category}
            </span>
        )
    })

    // 3. get the first paragraph
    const doc = new DOMParser().parseFromString(props.post.content, 'text/html')
    const content = doc.querySelector('p').textContent
    return (

        <Link className="link" to={`/blogposts/${props.post._id}`}>
            <div className="post box">
                <img
                    className="postImg"
                    src={awsS3Path + props.post.picture}
                    alt="blog cover"
                />

                <div className="postInfo">
                    <span className="postTitle">{props.post.title}</span>
                </div>

                <p className="postDesc">
                    {content}
                    {/* <div dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                            props.post.content,
                            {FORCE_BODY: true})}}>
                    </div> */}
                </p>

                <div className="postCats">
                    {catJSXElements}
                </div>
            </div>
        </Link>

    )
}

export default CardPost