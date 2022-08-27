import React, { useState } from "react";
import { axiosInstance } from "../../config";
import "./commentForm.css"

function CommentForm() {
    const [commentContent, setCommentContent] = useState("");
    const [username, setUsername] = useState("");

    // post comment
    const handleSubmit = async (event) => {

        // - create newpost with the editor state
        const newComment = {
            username,
            content: commentContent
        };

        try {
            // need the blog id
            const res = await axiosInstance.post("/api/comments", newComment);
        } catch (err) {

        }
    }

    return (
        <div className="commentFormWrapper">
            <span>Add a Comment</span>
            <form className="commentForm">


                <label>Name</label>
                <input type="text" onChange={(e) => {
                    setUsername(e.target.files[0]);
                }} />
                <label>Your Comment</label>
                <textarea
                    id="commentInput"
                    onChange={(e) => {
                        setCommentContent(e.target.files[0]);
                    }}
                    defaultValue={"I think ..."}
                />
                <button
                    type="button"
                    className="writeSubmitButton"
                    onClick={handleSubmit}
                >
                    Add
                </button>
            </form>


        </div>
    );

}

export default CommentForm;
