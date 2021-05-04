import React from "react"
import "./styles.css"


export default class Todolist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: null,
      title: "",
      category: "",
      date: "",
      tasks: props.tasks
    };

    this.clickAddHandler = this.clickAddHandler.bind(this);
    this.onTitleChangeHandler = this.onTitleChangeHandler.bind(this);
    this.onCategoryChangeHandler = this.onCategoryChangeHandler.bind(this);
    this.onDateChangeHandler = this.onDateChangeHandler.bind(this);
    this.taskDoneHandler = this.taskDoneHandler.bind(this);
    this.taskEditHandler = this.taskEditHandler.bind(this);
    this.taskDeleteHandler = this.taskDeleteHandler.bind(this);
  }

  taskCompletion() {
    const { tasks } = this.state;
    const totalTasksNum = tasks.length === 0 ? 1 : tasks.length;
    const completedTasksNum = tasks.filter((n) => n.isDone === true).length;
    return Math.floor((completedTasksNum * 100) / totalTasksNum);
  }

  onTitleChangeHandler(e) {
    this.setState((state) => ({ title: e.target.value }));
  }

  onCategoryChangeHandler(e) {
    this.setState((state) => ({ category: e.target.value }));
  }

  onDateChangeHandler(e) {
    this.setState((state) => ({ date: e.target.value }));
  }

  clickAddHandler() {
    const { edit, title, category, date, tasks } = this.state;

    if (title === "") return;

    if (edit === null) {
      const task = {
        id: generateID(),
        title: title,
        category: category,
        date: date,
        isDone: false
      };
      this.setState((state) => ({
        title: "",
        category: "",
        date: "",
        tasks: [task, ...state.tasks]
      }));
    } else {
      let task = tasks.find((n) => n.id === edit);
      task.title = title;
      task.category = category;
      task.date = date;
      this.setState((state) => ({
        title: "",
        category: "",
        date: "",
        tasks: tasks,
        edit: null
      }));
    }
  }

  taskDoneHandler(id) {
    this.setState((state) => {
      let { tasks } = state;
      let task = tasks.find((n) => n.id === id);
      task.isDone = !task.isDone;
      return { tasks: tasks };
    });
  }

  taskEditHandler(id) {
    this.setState((state) => {
      const task = state.tasks.find((n) => n.id === id);
      return {
        edit: id,
        title: task.title,
        category: task.category,
        date: task.date
      };
    });
  }

  taskDeleteHandler(id) {
    this.setState((state) => {
      let { tasks } = state;
      let task = tasks.find((n) => n.id === id);
      tasks.splice(tasks.indexOf(task), 1);
      return { tasks: tasks };
    });
  }

  render() {
    const { title, category, date, tasks, edit } = this.state;
    const dateOpt = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    return (
      <div class="todo">
        <Today className={"todo__date"} options={dateOpt} />
        <div class="todo__ctrls">
          <Input
            type={"text"}
            value={title}
            placeholder={"Task Name..."}
            onChangeHandler={this.onTitleChangeHandler}
          />
          <Input
            type={"text"}
            value={category}
            placeholder={"Task Category..."}
            onChangeHandler={this.onCategoryChangeHandler}
          />
          <Input
            type={"date"}
            value={date}
            onChangeHandler={this.onDateChangeHandler}
          />
          <Button onClickHandler={this.clickAddHandler}>
            {edit === null ? (
              <Icon>playlist_add</Icon>
            ) : (
              <Icon>playlist_add_check</Icon>
            )}
          </Button>
        </div>
        <div class="todo__list">
          <TaskList
            data={tasks}
            onDoneCallback={this.taskDoneHandler}
            onEditCallback={this.taskEditHandler}
            onDeleteCallback={this.taskDeleteHandler}
          />
        </div>
        <div class="todo__completion">
          Task Completion: {this.taskCompletion()}%
        </div>
      </div>
    );
  }
}

class TaskListItem extends React.Component {
  constructor(props) {
    super(props);

    this.clickDoneHandler = this.clickDoneHandler.bind(this);
    this.clickEditHandler = this.clickEditHandler.bind(this);
    this.clickDeleteHandler = this.clickDeleteHandler.bind(this);
  }

  clickDoneHandler() {
    const { onDoneCallback } = this.props;
    onDoneCallback(this.props.id);
  }

  clickEditHandler() {
    const { onEditCallback } = this.props;
    onEditCallback(this.props.id);
  }

  clickDeleteHandler() {
    const { onDeleteCallback } = this.props;
    onDeleteCallback(this.props.id);
  }

  render() {
    const { id, title, date, isDone } = this.props;
    return (
      <div class="task">
        <Button className="task__status" onClickHandler={this.clickDoneHandler}>
          {isDone ? (
            <Icon>check_box</Icon>
          ) : (
            <Icon>check_box_outline_blank</Icon>
          )}
        </Button>
        <div class={isDone ? "task__title crossout" : "task__title"}>
          {date ? `${date}:  ` : ""}
          {title}
        </div>
        <div class="task__ctrls">
          <Button onClickHandler={this.clickEditHandler}>
            <Icon>edit</Icon>
          </Button>
          <Button onClickHandler={this.clickDeleteHandler}>
            <Icon>delete</Icon>
          </Button>
        </div>
      </div>
    );
  }
}

function TaskList(props) {
  const { onDoneCallback, onEditCallback, onDeleteCallback } = props;
  const tasks = props.data.sort((a, b) => {
    if (a.category > b.category) return 1;
    if (a.category < b.category) return -1;
    return 0;
  });

  let currCategory = null;
  return (
    <ul>
      {tasks.map((v) => {
        let currTask = (
          <TaskListItem
            {...v}
            onDoneCallback={onDoneCallback}
            onEditCallback={onEditCallback}
            onDeleteCallback={onDeleteCallback}
          />
        );

        if (v.category != currCategory && v.category != "") {
          currCategory = v.category;
          return (
            <>
              <li key={generateID()}>
                <b>{currCategory}</b>
              </li>
              <li key={v.id}>{currTask}</li>
            </>
          );
        } else {
          return <li key={v.id}>{currTask}</li>;
        }
      })}
    </ul>
  );
}

function Button(props) {
  return (
    <button
      type="button"
      class={props.className}
      onClick={props.onClickHandler}
    >
      {props.children}
    </button>
  );
}

function Input(props) {
  return (
    <input
      type={props.type}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChangeHandler}
    />
  );
}

function Today(props) {
  const today = new Date();
  return (
    <div class={props.className}>
      {" "}
      Today: {today.toLocaleDateString("en-US", props.options)}
    </div>
  );
}

function Icon(props) {
  return <i class="material-icons">{props.children}</i>;
}


//---- helper functions ---//

function generateID(len = 5) {
  let id = "";
  for (let i = 0; i < len; i++) {
    id += Math.floor(Math.random() * 32).toString(32);
  }
  return id;
}