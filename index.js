  // DOM Elements
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');
  const timeDisplay = document.querySelector('.time');
  const dateDisplay = document.querySelector('.date');
  const timerDisplay = document.querySelector('.timer-display');
  const timerStartBtn = document.getElementById('timer-start-btn');
  const timerResetBtn = document.querySelector('.timer-controls .btn-reset');
  const progressBar = document.querySelector('.progress-bar');
  const timerStatus = document.getElementById('timer-status');
  const stopwatchDisplay = document.querySelector('.stopwatch-display');
  const stopwatchStartBtn = document.getElementById('stopwatch-start-btn');
  const stopwatchResetBtn = document.getElementById('stopwatch-reset-btn');
  const lapBtn = document.querySelector('.btn-lap');
  const lapsContainer = document.getElementById('laps');
  
  // State variables
  let timerInterval, stopwatchInterval;
  let timerIsRunning = false;
  let timerTotalTime = 0;
  let timerTimeRemaining = 0;
  let stopwatchIsRunning = false;
  let stopwatchStartTime = 0;
  let stopwatchElapsedTime = 0;
  let laps = [];
  
  // Tab switching functionality
  tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`${tab.dataset.tab}-content`).classList.add('active');
  }));
  
  // Clock functionality
  function updateClock() {
      const now = new Date();
      timeDisplay.textContent = now.toLocaleTimeString([], { hour12: true });
      dateDisplay.textContent = now.toLocaleDateString([], { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
      });
  }
  
  // Call immediately and then every second
  updateClock();
  setInterval(updateClock, 1000);
  
  // Timer functionality
  function formatTime(totalSeconds) {
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
  }
  
  function updateTimerInputs() {
      const hours = parseInt(document.getElementById('hours').value) || 0;
      const minutes = parseInt(document.getElementById('minutes').value) || 0;
      const seconds = parseInt(document.getElementById('seconds').value) || 0;
      
      timerTotalTime = hours * 3600 + minutes * 60 + seconds;
      timerTimeRemaining = timerTotalTime;
      timerDisplay.textContent = formatTime(timerTimeRemaining);
      progressBar.style.transform = 'scaleX(1)';
      timerStatus.textContent = 'Ready to start';
  }
  
  document.getElementById('hours').addEventListener('input', updateTimerInputs);
  document.getElementById('minutes').addEventListener('input', updateTimerInputs);
  document.getElementById('seconds').addEventListener('input', updateTimerInputs);
  
  function startTimer() {
      if (timerTimeRemaining <= 0) {
          updateTimerInputs();
      }
      
      if (timerTimeRemaining <= 0) {
          timerStatus.textContent = 'Please set a time greater than zero';
          return;
      }
      
      timerInterval = setInterval(() => {
          timerTimeRemaining--;
          
          const progress = timerTimeRemaining / timerTotalTime;
          progressBar.style.transform = `scaleX(${progress})`;
          
          timerDisplay.textContent = formatTime(timerTimeRemaining);
          timerStatus.textContent = 'Running...';
          
          if (timerTimeRemaining <= 0) {
              clearInterval(timerInterval);
              timerIsRunning = false;
              timerStartBtn.textContent = 'Start';
              timerStartBtn.classList.remove('btn-pause');
              timerStartBtn.classList.add('btn-start');
              timerStatus.textContent = 'Time\'s up!';
              
              showNotification('Timer Complete', 'Your timer has finished!');
          }
      }, 1000);
  }
  
  function showNotification(title, message) {
      if (Notification.permission === 'granted') {
          new Notification(title, { body: message });
      } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                  new Notification(title, { body: message });
              }
          });
      }
  }
  
  timerStartBtn.addEventListener('click', () => {
      if (timerIsRunning) {
          clearInterval(timerInterval);
          timerStartBtn.textContent = 'Resume';
          timerStartBtn.classList.remove('btn-pause');
          timerStartBtn.classList.add('btn-start');
          timerStatus.textContent = 'Paused';
      } else {
          startTimer();
          timerStartBtn.textContent = 'Pause';
          timerStartBtn.classList.remove('btn-start');
          timerStartBtn.classList.add('btn-pause');
      }
      timerIsRunning = !timerIsRunning;
  });
  
  timerResetBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      updateTimerInputs();
      timerStartBtn.textContent = 'Start';
      timerStartBtn.classList.remove('btn-pause');
      timerStartBtn.classList.add('btn-start');
      timerIsRunning = false;
  });
  
  // Initially set the timer
  updateTimerInputs();
  
  // Stopwatch functionality
  function formatStopwatchTime(time) {
      const milliseconds = String(Math.floor((time % 1000) / 10)).padStart(2, '0');
      const seconds = String(Math.floor((time / 1000) % 60)).padStart(2, '0');
      const minutes = String(Math.floor((time / (1000 * 60)) % 60)).padStart(2, '0');
      return `${minutes}:${seconds}.${milliseconds}`;
  }
  
  function updateStopwatch() {
      const currentTime = Date.now();
      const elapsedTime = currentTime - stopwatchStartTime + stopwatchElapsedTime;
      stopwatchDisplay.textContent = formatStopwatchTime(elapsedTime);
  }
  
  stopwatchStartBtn.addEventListener('click', () => {
      if (stopwatchIsRunning) {
          clearInterval(stopwatchInterval);
          stopwatchElapsedTime += Date.now() - stopwatchStartTime;
          stopwatchStartBtn.textContent = 'Resume';
          stopwatchStartBtn.classList.remove('btn-pause');
          stopwatchStartBtn.classList.add('btn-start');
      } else {
          stopwatchStartTime = Date.now();
          stopwatchInterval = setInterval(updateStopwatch, 10);
          stopwatchStartBtn.textContent = 'Pause';
          stopwatchStartBtn.classList.remove('btn-start');
          stopwatchStartBtn.classList.add('btn-pause');
      }
      stopwatchIsRunning = !stopwatchIsRunning;
  });
  
  stopwatchResetBtn.addEventListener('click', () => {
      clearInterval(stopwatchInterval);
      stopwatchDisplay.textContent = '00:00.00';
      stopwatchElapsedTime = 0;
      stopwatchStartBtn.textContent = 'Start';
      stopwatchStartBtn.classList.remove('btn-pause');
      stopwatchStartBtn.classList.add('btn-start');
      stopwatchIsRunning = false;
      laps = [];
      lapsContainer.innerHTML = '';
      lapsContainer.style.display = 'none';
  });
  
  lapBtn.addEventListener('click', () => {
      if (!stopwatchIsRunning) return;
      
      const currentTime = Date.now();
      const totalElapsed = currentTime - stopwatchStartTime + stopwatchElapsedTime;
      
      // Calculate lap time (time since last lap)
      const lapTime = laps.length === 0 ? 
          totalElapsed : 
          totalElapsed - laps[laps.length - 1].totalTime;
      
      laps.push({
          number: laps.length + 1,
          time: lapTime,
          totalTime: totalElapsed
      });
      
      // Display laps
      updateLaps();
  });
  
  function updateLaps() {
      lapsContainer.style.display = 'block';
      lapsContainer.innerHTML = '';
      
      // Find fastest and slowest laps
      if (laps.length > 1) {
          const lapTimes = laps.map(lap => lap.time);
          const fastestTime = Math.min(...lapTimes);
          const slowestTime = Math.max(...lapTimes);
          
          laps.forEach(lap => {
              const lapItem = document.createElement('div');
              lapItem.className = 'lap-item';
              
              // Add class for fastest/slowest
              if (lap.time === fastestTime) {
                  lapItem.classList.add('fastest');
              } else if (lap.time === slowestTime) {
                  lapItem.classList.add('slowest');
              }
              
              lapItem.innerHTML = `
                  <span>Lap ${lap.number}</span>
                  <span>${formatStopwatchTime(lap.time)}</span>
                  <span>${formatStopwatchTime(lap.totalTime)}</span>
              `;
              lapsContainer.prepend(lapItem);
          });
      } else if (laps.length === 1) {
          const lapItem = document.createElement('div');
          lapItem.className = 'lap-item';
          lapItem.innerHTML = `
              <span>Lap 1</span>
              <span>${formatStopwatchTime(laps[0].time)}</span>
              <span>${formatStopwatchTime(laps[0].totalTime)}</span>
          `;
          lapsContainer.appendChild(lapItem);
      }
  }
  
  // Request notification permission
  if ('Notification' in window) {
      Notification.requestPermission();
  }

