import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';

class TinyMCE extends Component {
    constructor(props) {
        super(props);

        this.state = { content: '' };
        this.handleEditorChange = this.handleEditorChange.bind(this);
    }

    handleEditorChange(content, editor) {
        this.setState({ content });
    }

    render() {
        console.log('content',this.state.content);
        
        return (
            <div >
                <Editor
                    apiKey="no-api-key"
                    init={{
                        width: 600,
                        plugins: [
                            'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
                            'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
                            'table emoticons template paste help'
                        ],
                        toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
                            'bullist numlist outdent indent | link image | print preview media fullpage | ' +
                            'forecolor backcolor emoticons | help',
                        menu: {
                            favs: { title: 'My Favorites', items: 'code visualaid | searchreplace | spellchecker | emoticons' }
                        },
                        menubar: 'favs file edit view insert format tools table help',
                        content_css: 'css/content.css'
                    }}

                    value={this.state.content}
                    onEditorChange={this.handleEditorChange}
                />
            </div>
        );
    }
}

export default TinyMCE;
