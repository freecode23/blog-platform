
import React from 'react';
import DOMPurify from 'dompurify';

// https://froala.com/wysiwyg-editor/docs/options/#toolbarButtons
import "froala-editor/js/plugins.pkgd.min";
import "froala-editor/js/plugins/font_size.min";
import "froala-editor/js/plugins/font_family.min";
import "froala-editor/js/plugins/video.min";

import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/plugins/video.min.css";

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


            {/* Show content if its not an empty string. model is the content */}
            <div className="editor-display-container">
                {editorContent.model !== "" ?
                    < div dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(editorContent, { FORCE_BODY: true })
                    }}></div> : "Content will be displayed here..."
                }
            </div>
        </div >
    );
}