import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../config";
import "./comments.css"

function Comments(props) {


    const commentsJSX = props.comments.map((comment) => {
        return (
            <>
                <span key={comment.username} className="commentUsername">
                    {comment.username}:
                </span>
                <span key={comment._id} className="comment">
                    {comment.content}
                </span>
            </>
        )
    })

    return (
        <div className="comments" >
            {commentsJSX}
        </div>
    );
}

export default Comments;