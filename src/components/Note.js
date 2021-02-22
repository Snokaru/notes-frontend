import React from 'react';
import { useParams } from "react-router-dom";

const Note = ({ notes, toggleImportance }) => {
  const id = useParams().id;
  const note = notes.find(n => n.id === id);
  return (
    <li className="note">
      {note.content}
      <button onClick={() => toggleImportance(id)}>
        {note.important ? "make not important" : "make important"}
      </button>
    </li>
  )
};

export default Note;