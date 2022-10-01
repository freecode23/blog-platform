
import React from 'react';
import DOMPurify from 'dompurify';

// https://froala.com/wysiwyg-editor/docs/options/#toolbarButtons
import "froala-editor/js/plugins.pkgd.min";
import "froala-editor/js/plugins/font_size.min";
import "froala-editor/js/plugins/font_family.min";
import "froala-editor/js/plugins/video.min";
import "froala-editor/js/plugins/link.min";

import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/plugins/video.min.css";

import { froalaConfig } from './config';
import FroalaEditor from 'react-froala-wysiwyg';

import "./froala.css"


export default function Froala(props) {
    const { editorContent, handleEditorChange, imageUploadToS3 } = props;
    // >>> NOTE1: IFRAME TAGS SHOWS UP HERE>>>>>>>>>
    // console.log("2) editorContent Froala Comp>>", editorContent)
    return (
        <div className="editor-wrapper">
            <div className="editor-container">
                <FroalaEditor
                    model={editorContent.model}
                    tag="textarea"
                    onModelChange={handleEditorChange}
                    config={froalaConfig}
                    imageUploadToS3={imageUploadToS3}
                />
            </div>

            <div className="editor-display-container">
                {editorContent.model !== "" ?
                    <div
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(editorContent, {
                                FORCE_BODY: true,
                                ALLOWED_TAGS: ["iframe", "img", "br", "p", "span", "a"],
                            }),
                        }}
                    ></div> : "Content will be displayed here..."
                }
            </div>
        </div>
    );
}


