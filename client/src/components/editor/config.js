import { apiUrl } from "../../config";

export const froalaConfig = {
  attribution: false,
  placeholderText: "Start typing...",
  imageUpload: true,
  fontSizeSelection: true,
  fontFamilySelection: true,
  videoResponsive: true,
  imageUploadMethod: "POST",
  imageAllowedTypes: ["jpeg", "jpg", "png"],
  imageUploadURL: apiUrl + "upload_froala",
  htmlAllowedEmptyTags: [
    "textarea",
    "a",
    "iframe",
    "object",
    "video",
    "style",
    ".fa",
    "p",
  ],
  imageUploadParam: "file",
  fontFamily: {
    "Arial,Helvetica,sans-serif": "Arial",
    "Georgia,serif": "Georgia",
    "Impact,Charcoal,sans-serif": "Impact",
    "Tahoma,Geneva,sans-serif": "Tahoma",
    "'Times New Roman',Times,serif": "Times New Roman",
    "Verdana,Geneva,sans-serif": "Verdana",
    "Space Grotesk": "Space Grotesk",
    "Open Sans": "Open Sans",
  },
  events: {
    "image.uploaded": function (response) {
      // 0. parse response and array from string
      const image = JSON.parse(response);

      // 1. set to empty array if it hasn't been set
      if (localStorage.getItem("froalaImages") == null) {
        localStorage.setItem("froalaImages", JSON.stringify([]))
      }

      // 2. get existing froalaImages from local
      const images_arr = JSON.parse(localStorage.getItem("froalaImages"));

      // 3. append new uploaded image to this arr
      try {
        images_arr.push(image.key);
      } catch (err) {
        console.log(err);
      }

      // 4. update localStorage with new image
      localStorage.setItem("froalaImages", JSON.stringify(images_arr));
    },
  },
  toolbarButtons: {
    moreText: {
      buttons: [
        "bold",
        "italic",
        "fontSize",
        "fontFamily",
        "underline",
        "strikeThrough",
        "textColor",
        "backgroundColor",
        // "insertVideo"
        // "subscript",
        // "superscript",
        // "inlineClass",
        // "inlineStyle",
        // "clearFormatting"
      ],
      buttonsVisible: 4,
    },
    moreParagraph: {
      buttons: [
        "alignLeft",
        "alignCenter",
        "formatOLSimple",
        "alignRight",
        "alignJustify",
        "formatOL",
        "formatUL",
        "paragraphFormat",
        "paragraphStyle",
        "lineHeight",
        "outdent",
        "indent",
        "quote",
      ],
    },
    moreRich: {
      buttons: [
        "insertLink",
        "insertImage",
        "insertVideo",
        "insertTable",
        "emoticons",
        // "fontAwesome",
        "specialCharacters",
        // "embedly",
        "insertFile",
        // "insertHR"
      ],
    },
    moreMisc: {
      buttons: [
        "undo",
        "redo",
        "fullscreen",
        "print",
        "getPDF",
        "spellChecker",
        "selectAll",
        "html",
        "help",
      ],
      align: "right",
      buttonsVisible: 2,
    },
  },
  pluginsEnabled: [
    "table",
    "spell",
    "quote",
    "save",
    "quickInsert",
    "paragraphFormat",
    "paragraphStyle",
    "fontFamily",
    "fontSize",
    "help",
    "draggable",
    "align",
    "link",
    "lists",
    "file",
    "image",
    "emoticons",
    "url",
    "video",
    "embedly",
    "colors",
    "entities",
    "inlineClass",
    "inlineStyle",
    // 'codeBeautif '
    // 'spellChecker',
    "imageTUI",
  ],
};
