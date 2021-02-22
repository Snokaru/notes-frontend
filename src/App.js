import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Switch, Route, Link,
} from "react-router-dom";

import noteService from "./services/notes";
import loginService from "./services/login";

import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import Login from "./components/Login";
import NoteForm from "./components/NoteForm";
import Note from "./components/Note";
import Notes from "./components/Notes";
import Home from "./components/Home";


const App = (props) => {
  const [notes, setNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const noteFormRef = useRef();

  const padding = {
    padding: 5
  };

  useEffect(() => {
    noteService.getAll().then((initialNodes) => setNotes(initialNodes));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      console.log(event.target.username.value);
      const user = await loginService.login({
        username: event.target.username.value,
        password: event.target.password.value,
      });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));

      noteService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setErrorMessage("Wrong Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };


  const toggleImportance = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) =>
        setNotes(notes.map((n) => (n.id === id ? returnedNote : n)))
      )
      .catch((error) => {
        setErrorMessage(`Note ${note.content} was already removed from server`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((n) => n.id !== id));
      });
  };

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility();
    noteService.create(noteObject).then((returnedNote) => {
      setNotes(notes.concat(returnedNote));
    });
  };

  return (
    <Router>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/login">login</Link>
      </div>
      <Notification message={errorMessage} />

      <Switch>
        <Route path="/notes/:id">
          <Note notes={notes} toggleImportance={toggleImportance}/>
        </Route>
        <Route path="/notes">
          <Notes notes={notes} /> 
        </Route>
        <Route path="/login">
          <Login onLogin={handleLogin} />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>

      <div>
        <i>Note app, Department of Computer Science 2020</i>
      </div>
    </Router>
  );
};

export default App;
