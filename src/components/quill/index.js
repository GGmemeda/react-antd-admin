import React from 'react';
import ReactQuill, {Quill} from 'react-quill';


const fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'sans-serif'];
const Font = Quill.import('formats/font');
Font.whitelist = fonts;
Quill.register(Font, true);

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  [{'direction': 'rtl'}],                         // text direction

  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  [{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  [{'font': fonts}],
  [{'align': []}],
  ['link', 'image'],
  ['clean']                                         // remove formatting button
];

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {contentHtml: props.value || props.defaultValue || ''};
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in this.props) {
      this.setState({contentHtml: nextProps.value || ''});
    }
  }

  handleChange(html) {
    if ('onChange' in this.props) {
      this.props.onChange(html);
    }
    this.setState({
      contentHtml: html
    });
  }

  modules = {
    toolbar: toolbarOptions
  };
  formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'code-block', 'background', 'align',
    'link', 'image', 'color'
  ];

  render() {
    return (
      <div className="quill-editor">
        {/*<CustomToolbar/>*/}
        <ReactQuill
          value={this.state.contentHtml}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          modules={this.modules}
          formats={this.formats}
        />
      </div>
    );
  }
}

export default Editor;
