import { getData, addData, getUserIds, clearData } from './storage.js';

// To prevent DOM execution in Jest or non-browser environments
if (typeof document !== "undefined") {
  // DOM Elements
  const userSelect = document.getElementById('user-select');
  const agendaList = document.getElementById('agenda-list');
  const noAgendaMessage = document.getElementById('no-agenda-message');
  const addTopicForm = document.getElementById('add-topic-form');
  const topicNameInput = document.getElementById('topic-name');
  const topicDateInput = document.getElementById('topic-date');
  const clearDataButton = document.getElementById('clear-data-button');

  // Set default date to today if topicDateInput exists
  if (topicDateInput) {
    topicDateInput.valueAsDate = new Date();
  }

  // Load users into dropdown
  loadUserSelect();

  function loadUserSelect() {
    const users = getUserIds(); 
    if (!userSelect) return;
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
    if(!userSelect) return;
    const userId = userSelect.value;
    clearDataButton.disabled = !userId; 

    if (!userId) return; 

    const agenda = getData(userId);
    agendaList.innerHTML = ''; 

    if (!agenda || agenda.length === 0 || !userId) {
      noAgendaMessage.style.display = 'block';
      noAgendaMessage.innerText = `No agenda available for user ${userId}.`;
      clearDataButton.disabled = 'none'; 

      return;
    }

    noAgendaMessage.style.display = 'none';

    // Filter out past dates and sort by date
    const currentDate = new Date();
    const futureAgenda = agenda
      .filter(item => new Date(item.date) >= normalizeDate(currentDate))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if(futureAgenda.length===0){
      noAgendaMessage.innerText = `No agenda available for user ${userId}.`;
      noAgendaMessage.style.display= 'block';

    }

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
    if (!topicName) {
      alert("Topic name cannot be empty!");
      return;
    }
    if (!startDate) {
      alert("Start date cannot be empty!");
      return;
    }
    const spacedDates = calculateReviewDates(normalizeDate(startDate));
    const newAgendaItems = spacedDates.map(date => ({
      topic: topicName,
      date: date, 
    }));

    addData(userId, newAgendaItems);

    displayAgenda();

    // Reset form
    topicNameInput.value = '';
    topicDateInput.valueAsDate = new Date();
  }
  
  // Enable/Disable Clear Data Button based on user selection
  userSelect.addEventListener('change', () => {
    const userId = userSelect.value;
  
    if (!userId) return;
  
    const agenda = getData(userId);
    displayAgenda(agenda);
  });
  
  // Clear data for the selected user
  clearDataButton.addEventListener('click', () => {
    const userId = userSelect.value;
    if (!userId) return;
  
    if (confirm("Are you sure you want to clear all data for this user?")) {
      clearData(userId);
      alert("Data cleared successfully!");
      displayAgenda([]); 
    }
  });
}

//export const normalizeDate = date => new Date(new Date(date).setHours(0, 0, 0, 0));
export const normalizeDate = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// Calculate spaced repetition dates (this is testable)
export function calculateReviewDates(date) {
  date = normalizeDate(date); 

  // --------------------------NO NEEDED ANYMORE-----------------------------------
  //const today = normalizeDate(new Date());
  //const weekReviewDate = normalizeDate(addWeeks(date,1));

  // if (date < today) {
    
  //   if(today.getDate() === date.getDate()) {
  //     return [
  //       addMonths(date, 1),
  //       addMonths(date, 3),
  //       addMonths(date, 6),
  //       addYears(date, 1),
  //     ];
  //   }
  //   // if(today > weekReviewDate) {
  //   //   return [
  //   //     today,
  //   //     addMonths(date, 1),
  //   //     addMonths(date, 3),
  //   //     addMonths(date, 6),
  //   //     addYears(date, 1),
  //   //   ];
  //   // }
  //   return [
  //       today,
  //       addMonths(date, 1),
  //       addMonths(date, 3),
  //       addMonths(date, 6),
  //       addYears(date, 1),
  //     ];
  // }
  // ----------------------------------------------------------------------------------

  return [
    addWeeks(date, 1),
    addMonths(date, 1),
    addMonths(date, 3),
    addMonths(date, 6),
    addYears(date, 1),
  ];
}

export function addWeeks(date, weeks) {
  const result = new Date(date);
  result.setDate(result.getDate() + weeks * 7);
  return result;
}

export function addMonths(date, months) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);

  // If the month rolls over incorrectly (i.e., fewer days exist), adjust to the last day of the month
  while (newDate.getMonth() !== (date.getMonth() + months) % 12) {
    newDate.setDate(newDate.getDate() - 1);
  }

  return newDate;
}


export function addYears(date, years) {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}
