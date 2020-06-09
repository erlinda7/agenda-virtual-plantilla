import React, { Component } from 'react';
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
/*
SunEditor.create('exampleOptions', {
  font: [
    'Arial',
    'tohoma',
    'Courier New,Courier'
  ],
  fontSize: [
    8, 10, 14, 18, 24, 36
  ],
  colorList: [
    ['#ccc', '#dedede', 'OrangeRed', 'Orange', 'RoyalBlue', 'SaddleBrown'],
    ['SlateGray', 'BurlyWood', 'DeepPink', 'FireBrick', 'Gold', 'SeaGreen'],
  ],
  paragraphStyles: [
    'spaced',
    'neon',
    {
      name: 'Custom',
      class: '__se__customClass'
    }
  ],
  textStyles: [
    'translucent',
    {
      name: 'Emphasis',
      style: '-webkit-text-emphasis: filled;'
    }
  ],
  width: '100%',
  maxWidth: '600px',
  minWidth: '400px',
  height: 'auto',
  videoWidth: '80%',
  youtubeQuery: 'autoplay=1&mute=1&enablejsapi=1',
  popupDisplay: 'local',
  resizingBar: false,
  buttonList: [
    'font', 'fontSize',
    'fontColor', 'hiliteColor', 'video',
    'fullScreen', 'codeView',
    'preview', 'save']
  ,
  callBackSave: function (contents) {
    alert(contents);
  }
});
*/
class SunEditorMyComponent extends Component {

  render() {

    return (
      <div>
        <p> My Other Contents </p>
        <SunEditor showToolbar={true} />
      </div>
    );
  }
}

export default SunEditorMyComponent;
