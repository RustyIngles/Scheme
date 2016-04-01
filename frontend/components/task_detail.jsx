var React = require('react'),
    ReactDOM = require('react-dom'),
    TaskStore = require('../stores/tasks'),
    TaskActions = require('../actions/task_actions'),
    ApiUtil = require('../util/api_util.js');

var TaskDetail = React.createClass({
  contextTypes: {
      router: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {task: TaskStore.find(this.props.params.taskId)}
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({task: TaskStore.find(newProps.params.taskId)});
  },

  componentDidMount: function () {
    this.taskStoreToken = TaskStore.addListener(this.setStateFromStore);
  },

  componentWillUnmount: function () {
    this.taskStoreToken.remove();
  },

  getStateFromStore: function () {
    if (!this.state.task) {
      return {task: TaskStore.find(this.props.params.taskId)}
    } else {
      return {
        task: TaskStore.find(this.state.task.id)
      }
    }
  },

  setStateFromStore: function () {
    this.setState(this.getStateFromStore());
  },

  storeUpdateTask: function () {
    this.state.task.name = this.refs.nameTextarea.value;
    TaskActions.updateTaskInStore(this.state.task);
  },

  apiUpdateTask: function () {
    ApiUtil.updateTask({
      id: this.state.task.id,
      name: this.state.task.name,
      description: this.state.task.description,
      completed: this.state.task.completed,
      deadline: this.state.task.deadline,
      assignee_id: this.state.task
    });
  },

  apiUpdateTaskName: function () {
    if (!this.state.task) {
      return;
    }

    if (!this.state.task.persisted) {
      this.apiUpdateTask();
    }
  },

  render: function () {
    if (this.state.task) {
      return (
        <section className="task-detail">
          <div className="fpo">FPO FPO</div>
          <div className="group edit-pane-name-complete">
            <button
              className="complete-task-button">
              <svg viewBox="0 0 32 32" className="check-complete">
                <polygon points="30,5.077 26,2 11.5,22.5 4.5,15.5 1,19 12,30"></polygon>
              </svg>
            </button>
            <textarea
              className="task-name-input"
              onChange={this.storeUpdateTask}
              onBlur={this.apiUpdateTaskName}
              onMouseOut={this.apiUpdateTaskName}
              ref="nameTextarea"
              value={this.state.task.name}>
            </textarea>
            </div>
          <p>{this.state.task.description}</p>
        </section>
      );
    } else {
      return (<div>loading...</div>);
    }
  }
});

module.exports = TaskDetail;