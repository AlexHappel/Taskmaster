// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

$(document).ready(function() {
    $("#taskForm").on("submit", handleAddTask);
});

// Todo: create a function to generate a unique task id
function generateTaskId() {
// if nextid is not a # or doesn't exist, set to 1
    let id = nextId;
    if (!nextId || isNaN(nextId)) {
        nextId = 1;
    }
    //increment nextid for next task
    nextId++;
    // store updated nextid to localstorage
    localStorage.setItem("nextId" , JSON.stringify(nextId));
    // return the generated task id
    return nextId;

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    // generate html for task card
    let taskCardHTML = `
    <div class="card task-card mb-3" id ="task-${task.id}">
        <div class="card-body">
            <h5 class="card-title">${task.description}</p>
            <button class="btn btn-danger delete-task" data-task-id=${task.id}">Delete</button>
        </div>
    </div>
    `;
    // return html for task card
    return taskCardHTML;
}    



// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    //clear existing task cards
    $(".lane .task-card").remove();
    //iterate through each task and create a task card
    if (taskList.length > 0) {
        taskList.forEach(task => {
            let taskCard = createTaskCard(task);
            $(`#${task.status}-cards`).append(taskCard);
        });
    }
    // Save task list to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Draggable task cards
    $(".task-card").draggable({
        containment: ".container", 
        revert: true,
        stack: ".task-card",
        scroll: true,
    });
    console.log("Rendered task list:", taskList);
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    let title = $("#taskTitle").val();
    let description = $("#taskDescription").val();
    let taskId = generateTaskId();
    let newTask = {
        id: taskId,
        title: title,
        description: description,
        status: "todo"
    };
    taskList.push(newTask);
    renderTaskList();
    $("#taskTitle").val("");
    $("#taskDescription").val("");
    $("#formModal").modal("hide");
}
// Todo: create a function to handle deleting a task
$(document).on("click", ".delete-task", handleDeleteTask);

function handleDeleteTask(event) {
    event.preventDefault();
    // Get the task ID from the data attribute of the clicked delete button
    let taskId = $(event.target).data("task-id");
    
    // Find the index of the task in the taskList array
    let taskIndex = taskList.findIndex(task => task.id === taskId);
    
    // If the task is found, remove it from the taskList array
    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        
        // Re-render the task list
        renderTaskList();
        
        // Update the tasks in local storage
        localStorage.setItem("tasks", JSON.stringify(taskList));
        
        console.log("Task deleted:", taskId);
    } else {
        console.log("Task not found:", taskId);
    }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
