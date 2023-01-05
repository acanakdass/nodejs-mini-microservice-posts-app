import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentList = ({ postId,commentsData }) => {
  const [comments, setComments] = useState([]);
  const fetchData = async () => {
    // const res = await axios.get(
    //   `http://localhost:4001/posts/${postId}/comments`
    // );
    // console.log(postId)
    // console.log(res.data)
    // setComments(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCommentContent=(comment)=>{
    switch (comment.status) {
      case 'rejected':
        return "The comment is rejected by moderation service"
      case 'approved':
        return comment.content
      case 'pending':
        return "The comment is pending for moderation..."
      default:
        return comment.content
    }
  }
  const returnCommentTxtColorByStatus=(status)=>{
    switch (status) {
      case 'rejected':
        return "red"
      case 'approved':
        return "blue"
      case 'pending':
        return "orange"
      default:
        return "black"
    }
  }
  const renderedComments = commentsData?.map((comment) => {
    let checkedContent= renderCommentContent(comment)
    let textColor = returnCommentTxtColorByStatus(comment.status)
    return <li style={{color:textColor}} key={comment.id}>{checkedContent}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
