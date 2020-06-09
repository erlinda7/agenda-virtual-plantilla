import React, { Component } from "react"
import { convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import { db } from '../../../services/firebase/setup'

const content = {
  "entityMap": {},
  "blocks": [
    {
      "key": "637gr",
      "text": "",
      "type": "unstyled",
      "depth": 0,
      "inlineStyleRanges": [],
      "entityRanges": [],
      "data": {}
    }
  ]
};

class Draft extends Component {
  constructor(props) {
    super(props);
    const contentState = convertFromRaw(content);
    const editorState = EditorState.createWithContent(contentState);
    this.state = {
      contentState,
      editorState
    }
  }

  onContentStateChange = (contentState) => {
    this.setState({
      contentState,
    });
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState
    });
  };

  async componentDidMount() {

    const docRef = await db.collection("settings").doc("termsOfService")
      .get().then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          return doc.data()
        } else {
          console.log("No such document!");
        }
      }).catch(function (error) {
        console.log("Error getting document:", error);
      });

    if (Object.keys(docRef).length !== 0) {
      this.setState({
        editorState: EditorState.createWithContent(convertFromRaw(docRef.content)),
      })
    }

  }
  enviarDatos = async () => {
    const { contentState } = this.state;
    await db
      .collection('settings')
      .doc('termsOfService')
      .update({ content: JSON.parse(JSON.stringify(contentState)) })
      .then(function () {
        console.log("Document successfully updated!");
      })

  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor

          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          onContentStateChange={this.onContentStateChange}
          
          toolbar={
            {
              options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history'],
              inline: {
                inDropdown: false,
                //className: "undefined",
                //component: undefined,
                //dropdownClassName: undefined,
                options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace', 'superscript', 'subscript'],
                // bold: { 
                //   //icon: bold, 
                // //  className: "undefined" 
                // },
                // italic: { icon: italic, className:" undefined" },
                // // underline: { icon: underline, className: undefined },
                // underline: { icon: underline},
                // strikethrough: { icon: strikethrough, className: "undefined" },
                // monospace: { icon: monospace, className: "undefined" },
                // superscript: { icon: superscript, className: "undefined" },
                // subscript: { icon: subscript, className: "undefined" },
              },
              blockType: {
                inDropdown: true,
                options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
                className: "undefined",
               // component: undefined,
                //dropdownClassName: undefined,
              },
              fontSize: {
                //icon: fontSize,
                options: [8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96],
                // className: undefined,
                // component: undefined,
                // dropdownClassName: undefined,
              },
              fontFamily: {
                options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
                // className: undefined,
                // component: undefined,
                // dropdownClassName: undefined,
              },
              list: {
                inDropdown: false,
                // className: undefined,
                // component: undefined,
                // dropdownClassName: undefined,
                options: ['unordered', 'ordered', 'indent', 'outdent'],
                // unordered: { icon: unordered, className: "undefined" },
                // ordered: { icon: ordered, className: "undefined" },
                // indent: { icon: indent, className: "undefined" },
                // outdent: { icon: outdent, className: "undefined" },
              },
              textAlign: {
                inDropdown: false,
                // className: undefined,
                // component: undefined,
                // dropdownClassName: undefined,
                options: ['left', 'center', 'right', 'justify'],
                // left: { icon: left, className: "undefined" },
                // center: { icon: center, className: "undefined" },
                // right: { icon: right, className: "undefined" },
                // justify: { icon: justify, className: "undefined "},
              },
              colorPicker: {
               // icon: color,
                // className: undefined,
                // component: undefined,
                // popupClassName: undefined,
                colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                  'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                  'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                  'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                  'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                  'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
              },
              link: {
                inDropdown: false,
                // className: undefined,
                // component: undefined,
                // popupClassName: undefined,
                // dropdownClassName: undefined,
                showOpenOptionOnHover: true,
                defaultTargetOption: '_self',
                options: ['link', 'unlink'],
                // link: { icon: link, className: "undefined "},
                // unlink: { icon: unlink, className: "undefined" },
                // linkCallback: undefined
              },
              emoji: {
               // icon: emoji,
                // className: undefined,
                // component: undefined,
                // popupClassName: undefined,
                emojis: [
                  '😀', '😁', '😂', '😃', '😉', '😋', '😎', '😍', '😗', '🤗', '🤔', '😣', '😫', '😴', '😌', '🤓',
                  '😛', '😜', '😠', '😇', '😷', '😈', '👻', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '🙈',
                  '🙉', '🙊', '👼', '👮', '🕵', '💂', '👳', '🎅', '👸', '👰', '👲', '🙍', '🙇', '🚶', '🏃', '💃',
                  '⛷', '🏂', '🏌', '🏄', '🚣', '🏊', '⛹', '🏋', '🚴', '👫', '💪', '👈', '👉', '👉', '👆', '🖕',
                  '👇', '🖖', '🤘', '🖐', '👌', '👍', '👎', '✊', '👊', '👏', '🙌', '🙏', '🐵', '🐶', '🐇', '🐥',
                  '🐸', '🐌', '🐛', '🐜', '🐝', '🍉', '🍄', '🍔', '🍤', '🍨', '🍪', '🎂', '🍰', '🍾', '🍷', '🍸',
                  '🍺', '🌍', '🚑', '⏰', '🌙', '🌝', '🌞', '⭐', '🌟', '🌠', '🌨', '🌩', '⛄', '🔥', '🎄', '🎈',
                  '🎉', '🎊', '🎁', '🎗', '🏀', '🏈', '🎲', '🔇', '🔈', '📣', '🔔', '🎵', '🎷', '💰', '🖊', '📅',
                  '✅', '❎', '💯',
                ],
              },
              embedded: {
                //icon: embedded,
                // className: undefined,
                // component: undefined,
                // popupClassName: undefined,
                // embedCallback: undefined,
                defaultSize: {
                  height: 'auto',
                  width: 'auto',
                },
              },
              image: {
                //icon: image,
                // className: undefined,
                // component: undefined,
                // popupClassName: undefined,
                urlEnabled: true,
                uploadEnabled: true,
                alignmentEnabled: true,
               // uploadCallback: undefined,
                previewImage: false,
                inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                alt: { present: false, mandatory: false },
                defaultSize: {
                  height: 'auto',
                  width: 'auto',
                },
              },
              remove: { 
                //icon: eraser, className:" undefined", 
            //  component: undefined 
            },
              history: {
                inDropdown: false,
                // className: undefined,
                // component: undefined,
                // dropdownClassName: undefined,
                options: ['undo', 'redo'],
                // undo: { icon: undo, className: "undefined" },
                // redo: { icon: redo, className: "undefined" },
              },
            }
          }
        />
        <button onClick={this.enviarDatos}>Enviar</button>
        {/* <textarea rows="50" cols="130"
          disabled
          value={JSON.stringify(this.state.contentState, null, 4)}
        /> */}
      </div>
    );
  }
}

export default Draft