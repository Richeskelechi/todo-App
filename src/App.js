import { useEffect, useState } from "react";
import { createTodos, deleteTodos, readTodos, updateTodos } from "./api";
import Preloader from "./components/Preloader";

function App() {
  const [todo, setTodo] =  useState({title: '', content: ''})
  const [todos, setTodos] = useState(null);
  const [currentId, setCurrentId] = useState(0);
  const [btn, setBtn] = useState('SUBMIT');
  const [message, setMessage] =  useState('');
  useEffect(() => {
    let currentTodo = currentId !== 0 ? todos.find(todo => todo._id === currentId) : {title: '', content: ''};
    setTodo(currentTodo);
    if(currentId !== 0){
      setBtn("UPDATE");
    } else {
      setBtn("SUBMIT");
    }
    // eslint-disable-next-line
  }, [currentId])

  useEffect(() => {
    const fetchData = async () =>{
      const result = await readTodos();
      setTodos(result.data);
      console.log(result.data)
    }
    fetchData();
  }, [currentId]);
  const clear = () =>{
    setCurrentId(0);
    setTodo({title:'', content:''});
  }
  useEffect(() => {
    const clearField = (e) =>{
      if(e.keyCode === 27){
        clear();
      }
    }
    window.addEventListener('keydown', clearField)
    return () => window.removeEventListener('keydown', clearField);
  }, [])
  const onSubmitHandler = async (e) =>{
    e.preventDefault();
    if(currentId !== 0){
      const result = await updateTodos(currentId, todo);
      console.log(result);
      setMessage('Todo Updated');
      setTimeout(() => {
        setMessage('');
        clear();
      }, 500);
    }else{
      const result = await createTodos(todo)
      setTodos([...todos, result.data])
      console.log(result);
      setMessage('Todo Created');
      setTimeout(() => {
        setMessage('');
        clear();
      }, 500);
    }
  }
  const removeTodo = async(id)=>{
    await deleteTodos(id);
    const result = await readTodos();
    // const todoCopy = [...todos];
    // todoCopy.filter(todo => todo._id !== id);
    setMessage('Todo Deleted Successfully');
    setTimeout(() => {
      setMessage('');
      clear();
       setTodos(result.data);
    }, 500);
  }
  return (
    
    <div className="container">
      <div className="row">
        <form className="col s12" onSubmit={onSubmitHandler}>
          <div className="row">
            {/* <pre>{JSON.stringify(todo)}</pre> */}
            <div className="input-field col s6">
              <i className="material-icons prefix">title</i>
              <input id="icon_prefix" type="text" value={todo.title} className="validate" onChange={e=>setTodo({...todo, title:e.target.value})} />
              <label htmlFor="icon_prefix">Title</label>
            </div>
            <div className="input-field col s6">
              <i className="material-icons prefix">description</i>
              <input id="description" type="text" value={todo.content} className="validate" onChange={e=>setTodo({...todo, content:e.target.value})} />
              <label htmlFor="description">Content</label>
            </div>
          </div>
          <div className='row right-align'>
            <button className='waves-effect waves-light btn'>{btn}</button>
          </div>
          { message ? <div className="card-panel teal lighten-2">{message}</div> : <span></span>  }
          
        </form>
        {
          !todos ? <Preloader /> : todos.length > 0 ?
          <ul className="collection">
            {todos.map((todo, index) =>(
              <li onClick={() => setCurrentId(todo._id)} key={todo._id} className="collection-item"><div><span >{index+1}</span><h5>{todo.title}</h5>
              <p>{todo.content}
               <a onClick={()=> removeTodo(todo._id)} href="#!" className="secondary-content"><i className="material-icons">delete</i></a>
              </p>
              </div></li>
            ))}
          </ul>
          : <div>No Todo In The Database</div>
        }
      </div>
    </div>

  );
}

export default App;
