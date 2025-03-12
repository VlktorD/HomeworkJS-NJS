const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'homework.txt');

fs.writeFile(filePath, 'HOMEWORK 02 in Basic Node', (err) => {
    if (err) {
        console.error('Грешка при запишување во датотека:', err);
        return;
    }
    console.log('Текстот е запишан во homework.txt');

    fs.appendFile(filePath, '\nFINISHED', (err) => {
        if (err) {
            console.error('Грешка при додавање во датотека:', err);
            return;
        }
        console.log('Текстот е додаден во homework.txt');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Грешка при читање на датотека:', err);
                return;
            }
            console.log('Содржини на датотека:', data);
        });
    });
});

const tasksFilePath = path.join(__dirname, 'tasks.json');

let tasks = [];

const loadTasks = () => {
    if (fs.existsSync(tasksFilePath)) {
        const data = fs.readFileSync(tasksFilePath, 'utf8');
        tasks = JSON.parse(data);
    }
};

const saveTasks = () => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

const markTaskAsCompleted = (taskId) => {
    loadTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = true;
        saveTasks();
        console.log(`Задача ${taskId} е означена како завршена`);
    } else {
        console.log(`Задача ${taskId} не е пронајдена`);
    }
};

const generateRandomEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `user${randomString}@mail.com`;
};

const addOwnerToTasks = () => {
    loadTasks();
    tasks.forEach(task => {
        if (!task.owner) {
            task.owner = generateRandomEmail();
        }
    });
    saveTasks();
};

const getTasksByOwner = (ownerEmail) => {
    loadTasks();
    return tasks.filter(task => task.owner === ownerEmail);
};

const deleteAll = () => {
    loadTasks();
    tasks = [];
    saveTasks();
    console.log('Сите задачи се избришани');
};

tasks = [{ id: 1, description: 'Научи Node.js', completed: false }];
saveTasks();
addOwnerToTasks();
console.log('Задачи:', tasks);
markTaskAsCompleted(1);
console.log('Задачи по сопственик:', getTasksByOwner(tasks[0].owner));
