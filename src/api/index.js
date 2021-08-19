import axios from 'axios';

// this is the url to the serve folder with the route for getting and creating todos 
// const url = "http://localhost:3005/api";
const url = 'https://richestodos.herokuapp.com/api'

export const readTodos = () => axios.get(url);
export const createTodos = newTodo => axios.post(url, newTodo);
export const updateTodos = (id, updateTodo) => axios.patch(`${url}/${id}`, updateTodo);
export const deleteTodos = (id) => axios.delete(`${url}/${id}`);