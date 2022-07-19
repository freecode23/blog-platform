
import React from 'react';
import DOMPurify from 'dompurify';

import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";

import "froala-editor/js/plugins/font_size.min.js";
import { froalaConfig } from './config';
import FroalaEditor from 'react-froala-wysiwyg';
import "./froala.css"


export default function Froala(props) {
    const { editorContent, handleEditorChange, imageUploadToS3 } = props;


    return (
        <div className="editor-wrapper">
            <div className="editor-container">
                <FroalaEditor
                    model={editorContent.model}
                    tag="textarea"
                    onModelChange={handleEditorChange} // will get data and pass to the function
                    config={froalaConfig}
                    imageUploadToS3={imageUploadToS3}
                />
            </div>


            <div className="editor-display-container">
                {/* <div dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(editorContent.model, {FORCE_BODY: true})}}></div> */}
                <div dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(editorContent, { FORCE_BODY: true })
                }}></div>
            </div>
        </div>
    );
}