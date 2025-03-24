const fs = require('fs'); // За работа со датотеки
const path = require('path'); // За да правиме патеки до датотеки

// Овде си правиме патеки до двете датотеки со кои ќе работиме
const filePath = path.join(__dirname, 'homework.txt');
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Ова е делот каде ја правиме homework.txt и пишуваме во неа
fs.writeFile(filePath, 'HOMEWORK 02 in Basic Node', (err) => {
    if (err) {
        console.error('Ох, нешто тргна наопаку при пишувањето:', err);
        return; // Ако има грешка, излегуваме од функцијава
    }
    console.log('Успешно го запишав текстот во homework.txt!');

    // Сега додаваме уште една линија во датотеката
    fs.appendFile(filePath, '\nFINISHED', (err) => {
        if (err) {
            console.error('Ех, пак грешка, овој пат при додавањето:', err);
            return;
        }
        console.log('Додадов FINISHED во homework.txt, готово!');

        // Ајде да ја прочитаме датотеката и да видиме што имаме
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Не можам да ја прочитам датотеката, проблем:', err);
                return;
            }
            console.log('Еве што има во датотеката:', data);
        });
    });
});

// Делот за менаџирање задачи - почнуваме со празен список
let tasks = [];

// Функција да ги вчитаме задачите од tasks.json ако постои
const loadTasks = () => {
    if (fs.existsSync(tasksFilePath)) {
        const data = fs.readFileSync(tasksFilePath, 'utf8');
        tasks = JSON.parse(data); // Ги парсираме во објекти
    } else {
        tasks = []; // Ако нема датотека, си почнуваме од нула
    }
};

// Оваа функција ги зачувува задачите во tasks.json
const saveTasks = () => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2)); // 2 е за убаво форматирање
};

// Означуваме задача како завршена по ID
const markTaskAsCompleted = (taskId) => {
    loadTasks(); // Прво ги вчитуваме задачите
    const task = tasks.find(t => t.id === taskId); // Бараме задача со тој ID
    if (task) {
        task.completed = true; // Ја означуваме како готова
        saveTasks(); // Ги зачувуваме промените
        console.log(`Задачата ${taskId} е завршена, супер!`);
    } else {
        console.log(`Нема задача со ID ${taskId}, што е ова?`);
    }
};

// Ова прави случаен е-маил за сопственик, чисто за забава
const generateRandomEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    return `user${randomString}@mail.com`; // Едноставно, ама функционира
};

// Додава сопственик на секоја задача што нема
const addOwnerToTasks = () => {
    loadTasks(); // Вчитуваме задачи
    tasks.forEach(task => {
        if (!task.owner) {
            task.owner = generateRandomEmail(); // Ако нема сопственик, му даваме е-маил
        }
    });
    saveTasks(); // Зачувуваме
};

// Филтрира задачи по сопственик
const getTasksByOwner = (ownerEmail) => {
    loadTasks(); // Пак вчитуваме за да сме сигурни
    return tasks.filter(task => task.owner === ownerEmail); // Враќаме само тие со тој е-маил
};

// Брише сè, чисто за ресет
const deleteAll = () => {
    loadTasks();
    tasks = []; // Ги бришеме сите задачи
    saveTasks();
    console.log('Сите задачи се избришани, чиста работа!');
};

// Почетна иницијализација - додаваме пример задача ако нема ништо
loadTasks();
if (tasks.length === 0) {
    tasks = [{ id: 1, description: 'Научи Node.js', completed: false }];
    saveTasks(); // Зачувуваме за да не почнуваме од нула секој пат
}
addOwnerToTasks(); // Додаваме сопственици
console.log('Еве ги задачите сега:', tasks);
markTaskAsCompleted(1); // Означуваме дека првата е готова
console.log('Задачи на сопственикот:', getTasksByOwner(tasks[0].owner));