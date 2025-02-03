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