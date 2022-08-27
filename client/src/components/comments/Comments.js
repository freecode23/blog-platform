import React, { useState } from "react";
import { axiosInstance } from "../../config";
import "./comments.css"

function Comments(props) {
    const commentsJSX = props.comments.map((comment) => {
        console.log(comment._id);
        console.log(comment.content);

        return (
            <>
                <span key={comment._id} className="commentUsername">
                    {comment.username}
                </span>
                <span key={comment._id} className="comment">
                    {comment.content}
                </span>
            </>
        )
    })

    return (
        <div className="comments">
            {commentsJSX}
        </div>
    );
}

export default Comments;