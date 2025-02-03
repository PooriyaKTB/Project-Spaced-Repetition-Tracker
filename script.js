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

// Display agenda
displayAgenda();

function displayAgenda(agenda) {
  agendaList.innerHTML = ''; // Clear previous agenda

  if (!agenda || agenda.length === 0 || !userId) {
    noAgendaMessage.style.display = 'block';
    noAgendaMessage.innerText = "No agenda available."
    return;
  }

  noAgendaMessage.style.display = 'none';

  // Filter out past dates and sort by date
  const currentDate = new Date();
  const futureAgenda = agenda
    .filter(item => new Date(item.date) >= currentDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  futureAgenda.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.topic} - ${new Date(item.date).toDateString()}`;
    agendaList.appendChild(li);
  });
}