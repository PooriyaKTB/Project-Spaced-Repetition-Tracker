import { getData, addData, getUserIds, clearData } from './storage.js';

// DOM Elements
const userSelect = document.getElementById('user-select');
const agendaList = document.getElementById('agenda-list');
const noAgendaMessage = document.getElementById('no-agenda-message');
const addTopicForm = document.getElementById('add-topic-form');
const topicNameInput = document.getElementById('topic-name');
const topicDateInput = document.getElementById('topic-date');
const clearDataButton = document.getElementById('clear-data-button');

// Set default date to today
topicDateInput.valueAsDate = new Date();

// Load users into dropdown
loadUserSelect();

function loadUserSelect() {
  const users = getUserIds(); // Get user IDs from storage.js
  users.forEach((userId) => {
    const option = document.createElement("option");
    option.value = userId;
    option.textContent = `User ${userId}`;
    userSelect.appendChild(option);
  });
}

userSelect.addEventListener('change', () => {
  displayAgenda();
});

// Display agenda
displayAgenda();

function displayAgenda() {
  const userId = userSelect.value;
  clearDataButton.disabled = !userId; 

  if (!userId) return; 

  const agenda = getData(userId);
  agendaList.innerHTML = ''; // Clear previous agenda

  if (!agenda || agenda.length === 0 || !userId) {
    noAgendaMessage.style.display = 'block';
    noAgendaMessage.innerText = `No agenda available for ${userId}.`
    return;
  }

  noAgendaMessage.style.display = 'none';

  // Filter out past dates and sort by date
  const currentDate = new Date();
  const futureAgenda = agenda
    .filter(item => new Date(item.date) >= normalizeDate(currentDate))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  futureAgenda.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.topic} - ${new Date(item.date).toDateString()}`;
    agendaList.appendChild(li);
  });
}

// Add new topic
addTopicForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTopic();
});

function addTopic(){
  const userId = userSelect.value;
  const topicName = topicNameInput.value;
  const startDate = new Date(topicDateInput.value);

  if (!userId) {
    alert("Please select a user first!");
    return;
  }
  const spacedDates = calculateReviewDates(normalizeDate(startDate));
  const newAgendaItems = spacedDates.map(date => ({
    topic: topicName,
    date: date, 
  }));

  console.log(newAgendaItems);
  addData(userId, newAgendaItems);

  displayAgenda();

  // Reset form
  topicNameInput.value = '';
  topicDateInput.valueAsDate = new Date();

}

// Calculate spaced repetition dates
function calculateReviewDates(date) {
  if(date<normalizeDate(new Date))
    return [
      addWeeks(date, 1),
      addMonths(date, 1),
      addMonths(date, 3),
      addMonths(date, 6),
      addYears(date, 1)
  ];
  else 
  return [
    addWeeks(date, 1),
    addMonths(date, 1),
    addMonths(date, 3),
    addMonths(date, 6),
    addYears(date, 1)
  ];
}

function addWeeks(date, weeks) {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function addYears(date, years) {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}
const normalizeDate = date => new Date(new Date(date).setHours(0, 0, 0, 0));
