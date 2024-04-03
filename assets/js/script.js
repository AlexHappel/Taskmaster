// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

$(document).ready(function() {
    $("#taskForm").on("submit", handleAddTask);
    $(document).on("click", ".delete-task", handleDeleteTask);
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
            <h5 class="card-title">${task.description}</h5>
            <button class="btn btn-danger delete-task" data-task-id="${task.id}">Delete</button>
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


function handleDeleteTask(event) {
    event.preventDefault();
    // Get task ID from data attribute of the delete button
    let taskId = $(event.target).data("task-id");
    console.log("Deleting Task ID:", taskId);
    
    // Find index of task in taskList array
    let taskIndex = taskList.findIndex(task => task.id === taskId);
    console.log("Task Index:", taskIndex);
    
    // If task is found, remove it from taskList array
    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
        console.log("Task List After Deletion:", taskList);
        
        // Re-render task list
        renderTaskList();
        
        // Update tasks in local storage
        localStorage.setItem("tasks", JSON.stringify(taskList));
        
        console.log("Task deleted:", taskId);
    } else {
        console.log("Task not found:", taskId);
    }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    // Get the id of the dropped task
    let taskId = ui.draggable.attr("id").split("-")[1];
    
    // Get the status of the lane where the task was dropped
    let newStatus = $(this).attr("id").split("-")[0];
    
    // Find the task in the taskList array
    let taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));
    
    // If the task is found, update its status
    if (taskIndex !== -1) {
        taskList[taskIndex].status = newStatus;
        
        // Re-render the task list to reflect the updated status
        renderTaskList();
        
        console.log(`Task ${taskId} moved to ${newStatus}`);
    } else {
        console.log(`Task ${taskId} not found`);
    }
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function() {
    $("#taskForm").on("submit", handleAddTask);
    $(document).on("click", ".delete-task", handleDeleteTask);
    $(".task-card").draggable({
        containment: ".container", 
        revert: true,
        stack: ".task-card",
        scroll: true,
    });
    $(".lane").droppable({
        accept: ".task-card",
        drop: handleDrop
    });
    renderTaskList();
});
