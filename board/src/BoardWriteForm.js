import React, { Component } from "react";
//글쓰기 위한 editor 사용
import CKEditor from "ckeditor4-react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class BoardWriteForm extends Component {
  state = {
    data: "",
  };
  writeBoard = () => {
    let url;
    let send_param;

    const boardTitle = this.boardTitle.value;
    const boardContent = this.state.data;

    if (boardTitle === undefined || boardTitle === "") {
      alert("글 제목을 입력해주세요.");
      boardTitle.focus();
      return;
    } else if (boardContent === undefined || boardContent === "") {
      alert("글 내용을 입력해주세요.");
      boardContent.focus();
      return;
    }

    if (this.props.location.query !== undefined) {
      //글 수정일 때
      url = "http://localhost:8080/board/update";
      send_param = {
        headers,
        _id: this.props.location.query._id,
        title: boardTitle,
        content: boardContent,
      };
    } else {
      url = "http://localhost:8080/board/write";
      send_param = {
        headers,
        _id: window.sessionStorage.getItem("login_id"),
        title: boardTitle,
        content: boardContent,
      };
    }

    axios
      .post(url, send_param)
      .then((returnData) => {
        if (returnData.data.message) {
          alert(returnData.data.message);
          window.location.href = "/";
        } else {
          alert("글쓰기 실패");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  onEditorChange = (evt) => {
    this.setState({
      data: evt.editor.getData(),
    });
  };
  componentDidMount() {
    if (this.props.location.query !== undefined) {
      this.boardTitle.value = this.props.location.query.title;
    }
  }
  componentWillMount() {
    //componentdidmount 되기 이전.
    //컴포넌트가 생성되는 과정에서 호출된다.
    //render 이전에 호출됨!
    if (this.props.location.query !== undefined) {
      this.setState({
        data: this.props.location.query.content,
      });
    }
  }
  render() {
    const divStyle = {
      margin: 50,
    };
    const titleStyle = {
      marginBottom: 5,
    };
    const buttonStyle = {
      marginTop: 5,
    };
    return (
      <div style={divStyle} className="App">
        <h2>글쓰기</h2>
        <Form.Control
          type="text"
          style={titleStyle}
          placeholder="글 제목"
          ref={(ref) => (this.boardTitle = ref)}
        />
        <CKEditor
          data={this.state.data}
          onChange={this.onEditorChange}
        ></CKEditor>
        <Button style={buttonStyle} onClick={this.writeBoard} block>
          저장하기
        </Button>
      </div>
    );
  }
}
export default BoardWriteForm;