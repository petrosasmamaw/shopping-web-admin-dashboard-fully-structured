import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments, deleteComment, selectComments } from "../../slices/commentsSlice";

const AdminComments = () => {
  const dispatch = useDispatch();
  const comments = useSelector(selectComments);

  useEffect(() => { dispatch(fetchComments()); }, [dispatch]);

  const del = (id) => {
    if (!confirm("Delete this comment?")) return;
    dispatch(deleteComment(id));
  };

  return (
    <div className="card">
      <h2>Admin Comments</h2>
      {comments.length === 0 ? <p>No comments</p> : comments.map((c) => (
        <div key={c.id} className="comment">
          <div><strong>{c.user_email || "Anonymous"}</strong> — <small>{new Date(c.created_at).toLocaleString()}</small></div>
          <p className="comment-text">{c.content}</p>
          <button className="ghost" onClick={() => del(c.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminComments;
