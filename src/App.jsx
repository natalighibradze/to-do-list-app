import reactLogo from './assets/react.svg'
import './App.css'
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';



const ToDo = () => {
  const [todo, setTodo] = useState([]);
  const [edit, setEdit] = useState(false);
  const [todoEdit, setTodoEdit] = useState({
    id: null,
    title: ''
  });

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => setTodo(data.slice(0, 5)));
  }, []);

  const handleEdit = (todo) => {
    setEdit(true);
    setTodoEdit(todo);
  };

  const handleDelete = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        const todos = todo.filter(todo => {
          return todo.id !== id;
        });
        setTodo(todos);
        console.log('Item deleted');
      });
  };

  const handleChange = (e) => {
    setTodoEdit({ ...todoEdit, title: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`https://jsonplaceholder.typicode.com/todos/${todoEdit.id}`, {
      method: 'POST',
      body: JSON.stringify(todoEdit),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        const todos = todo.map(todo => (todo.id === todoEdit.id ? todoEdit : todo));
        setTodo(todos);
        setEdit(false);
        console.log('Item edited');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('https://jsonplaceholder.typicode.com/todos', {
      method: 'POST',
      body: JSON.stringify(todoEdit),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(response => response.json())
      .then(data => {
        setTodo([...todo, data]);
        setEdit(false);
        console.log('Item added');
      });
  };

  const showEditForm = () => {
    return (
      <form onSubmit={handleUpdate}>
        <input type="text" name="title" value={todoEdit.title} onChange={handleChange} />
        <button type="submit">Update</button>
      </form>
    );
  };

  const showAddForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <input style={{width: "180px", height: "20px"}} type="text" name="title" placeholder="Add new todo" value={todoEdit.title} onChange={handleChange} />
        <button style={{padding: "7px 10px", backgroundColor: "#94bbe9", color: "black"}} type="submit">Add Todo</button>
      </form>
    );
  };

  const showTodos = () => {
    return todo.map(todo => (
      <div key={todo.id}>
        {edit && todoEdit.id === todo.id ? (
          showEditForm()
        ) : (
          <div>
            <span>{todo.title}</span>
            <button style={{padding: "3px 15px", backgroundColor: "transparent", color: "black"}} onClick={() => handleEdit(todo)}>Edit</button>
            <button style={{padding: "3px 15px", backgroundColor: "transparent", color: "red"}}onClick={() => handleDelete(todo.id)}> X </button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div>
      {showAddForm()}
      {showTodos()}
    </div>
  );
};

export default ToDo;