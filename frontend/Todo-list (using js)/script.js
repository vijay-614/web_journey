let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {

        const li = document.createElement("li");
        li.classList.add("task");

        li.innerHTML = `
            <span class="${task.completed ? "completed" : ""}">
                ${task.text}
            </span>

            <div>
                <button class="complete-btn" data-index="${index}">
                    Complete
                </button>

                <button class="delete-btn" data-index="${index}">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});

taskList.addEventListener("click", function(event) {

    if (event.target.classList.contains("delete-btn")) {

        const index = event.target.dataset.index;

        tasks.splice(index, 1);

        saveTasks();
        renderTasks();
    }

    if (event.target.classList.contains("complete-btn")) {

        const index = event.target.dataset.index;

        tasks[index].completed =
            !tasks[index].completed;

        saveTasks();
        renderTasks();
    }

});

renderTasks();