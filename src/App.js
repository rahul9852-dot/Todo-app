import React from "react"

import "./styles.css";
import Todolist from "./Todolist";

export default function App() {
  const DATA = [
    {
      id: 1,
      title: "Loard Of The Rings",
      category: "Movies",
      date: "",
      isDone: false
    },
    { id: 2, title: "God Father I", category: "Movies", date: "", isDone: false },
    {
      id: 3,
      title: "Seven Angry Man",
      category: "Movies",
      date: "",
      isDone: false
    },
    { id: 4, title: "Pulp Fiction", category: "Movies", date: "", isDone: true },
    {
      id: 5,
      title: "The Brothers Karamazov",
      category: "Books",
      date: "",
      isDone: true
    },
    {
      id: 6,
      title: "The Master and Margarita",
      category: "Books",
      date: "",
      isDone: false
    },
    { id: 7, title: "Don Quixote", category: "Books", date: "", isDone: false }
  ];
  
  return (
    <div className="App">

      <Todolist tasks={DATA}/>
      
    </div>
  );
}

