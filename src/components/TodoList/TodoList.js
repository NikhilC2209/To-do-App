import React, {useState, useEffect} from "react"
import "./TodoList.scss"
import Input from "../Input Bar/Input.js"
import { BiTrash } from 'react-icons/bi';
import { MdDone } from 'react-icons/md';
import { IconContext } from "react-icons/lib";

import db from '../../Firebase.js';

export default function Tasks(props) {

    function getFirebaseArray() {
        const tempArray = [];
        db.collection("Todos").get()
        .then(snapshot => {
            snapshot.docs.forEach(tasks => {
                tempArray.push(tasks.data())
            })
            //setTasksArray(tempArray);
        })
        return tempArray;
    }

    const firebaseArray = getFirebaseArray();

    const presentArray = []
    useEffect(() => {
        db.collection("Todos").get()
        .then(snapshot => {
            const tempArray = [...presentArray]
            snapshot.docs.forEach(tasks => {
                tempArray.push(tasks.data())
            })
            setTasksArray(tempArray);
        })
    }, [])

    const [tasksArray, setTasksArray] = useState(presentArray)

    const addTodo = (todo) => {
        const newTodos = [todo,...tasksArray]
        const taskId = todo.task_name.split(' ');
        db.collection("Todos").doc(taskId[0]).set(todo)
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
        setTasksArray(newTodos);
    }

    const toggleTodo = (index) => {
        const toggleTasks = [...tasksArray];
        console.log(toggleTasks[index].completed);
        toggleTasks[index].completed = (toggleTasks[index].completed === false) ? true : false;
        const taskId = toggleTasks[index].task_name.split(' ');
        db.collection("Todos").doc(taskId[0]).update({
            completed: (toggleTasks[index].completed === false) ? false : true
        });
        setTasksArray(toggleTasks);
    }

    const deleteTodo = (index) => {
        const tasks = [...tasksArray]
        const dbidArray = tasks[index].task_name.split(' ')
        db.collection("Todos").doc(dbidArray[0]).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
        tasks.splice(index,1);
        setTasksArray(tasks);
    }

    const tickIcon = (item, index) => { 
        if(item.completed === false) {
            return  <IconContext.Provider value = {{ className: "icon-black" }}>
                        <MdDone onClick = {() => toggleTodo(index)}/>
                    </IconContext.Provider>
        }
        else {
            return  <IconContext.Provider value = {{ className: "icon-green" }}>
                        <MdDone onClick = {() => toggleTodo(index)}/>
                    </IconContext.Provider>
        }
    }

    const delIcon = (index) => {
        return <IconContext.Provider value = {{ className: "icon-del" }}>
                    <BiTrash onClick = {() => deleteTodo(index)}/>
                </IconContext.Provider>
    }

    const peekStatus = (status) => {
        if(status === "Completed") {
            const tasks = [...firebaseArray];
            const compTasks = [];
            tasks.map((item) => {
                if(item.completed === true) {
                    compTasks.push(item);
                }
            })  
            setTasksArray(compTasks);
        }

        if(status === "Incomplete") {
            const tasks = [...firebaseArray];
            const incompTasks = [];
            tasks.map((item) => {
                if(item.completed === false) {
                    incompTasks.push(item);
                }
            })  
            setTasksArray(incompTasks);
        }

        if(status === "All") {
            const allTasksArray = [...firebaseArray];
            setTasksArray(allTasksArray);
        }
    }

    return (
        <div>
            <Input onSubmit = {addTodo} status = {peekStatus}/>
            <div className="container">
                {tasksArray.map((item,index) => (
                    <div className="cont-child" key={item.id}>
                        {item.task_name}
                        <div>
                            {tickIcon(item,index)}
                            {delIcon(index)}
                        </div>
                    </div>    
                ))}
            </div>
        </div>
    )
}