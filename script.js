//setting up local storage
let select = document.querySelector('select');
window.onload = function () {
  if (!localStorage.getItem('file'))
    localStorage.setItem('file', select.value);
  else
    select.value = localStorage.getItem('file');
}
select.onchange = function () {
  localStorage.setItem('file', this.value);
  location.reload();
}
//selecting elements
let t;
let objLength = document.querySelectorAll('.number');
let container = document.querySelector('.container');
let button = document.querySelector('#submit');
let minutes = document.querySelector('.minutes');
let seconds = document.querySelector('.seconds');
let score = document.querySelector('.score');
let bulletsSpans = document.querySelector('.bullets .spans');

let gradeCounter = 0;
let counter = 0;
//fetch data
function fetchData() {
  fetch(localStorage.getItem('file') + '.json').then(
    (result) => {
      console.log(result);//full response
      promise = result.json();//fullfilled promise,we wait to extract data from
      console.log(promise);
      return promise;//this will return the promiseResult after wich is a json object
    }
  ).then(
    (data) => {
      objLength[0].textContent = data.length;
      objLength[1].textContent = data.length;
      createBullets(data.length);
      displayData(data[counter]);
      timer(10);
      let currentQuestion = bulletsSpans.querySelectorAll('span');
      button.addEventListener('click', function () {
        if (counter < data.length - 1) {
          if (checkValue(data[counter].answer))
            gradeCounter++;
          counter++;
          currentQuestion[counter].classList.add('current-question');
          container.innerHTML = '';
          clearInterval(t);
          timer(10);
          displayData(data[counter]);
        } else {
          if (checkValue(data[counter].answer))
            gradeCounter++;
          document.querySelector('.got').textContent = gradeCounter;
          button.style.cssText = 'display:none';
          container.innerHTML = '';
          document.querySelector('.bullets').remove();
          score.classList.remove('hidden');
          console.log(gradeCounter);
        }
      })
    }
  )
}
fetchData();
//creating bullets
function createBullets(questionsCount) {
  for (let i = 0; i < questionsCount; i++){
    let span = document.createElement('span');
    if (i == 0)
      span.classList.add('current-question')
    bulletsSpans.append(span)
  }
}
//display data
function displayData(obj) {
  let randomArray = [];
  for (let i = 0; i < obj.choices.length; i++)
    randomArray.push(i);
  let questionArea = document.createElement('div');
  questionArea.classList.add('question-area');
  container.append(questionArea);
  let h3 = document.createElement('h3');
  h3.textContent = obj.question;
  questionArea.append(h3);
  let answersArea = document.createElement('div');
  answersArea.classList.add('answers-area');
  container.append(answersArea);
  for (let i = 0; i < obj.choices.length; i++){
    let random = Math.floor(Math.random() * randomArray.length);
    let answer = document.createElement('div');
    answer.classList.add('answer');
    let input = document.createElement('input');
    input.name = 'answers';
    input.type = 'radio';
    input.id = `answer-${i + 1}`;
    answer.append(input);
    if (i == 0)
      input.checked = true;
    let label = document.createElement('label');
    label.textContent = obj.choices[randomArray[random]];
    label.htmlFor = `answer-${i + 1}`;
    answer.append(label);
    randomArray.splice(random, 1);
    answersArea.append(answer);
  }
}
//timer
function timer(x,count) {
  t = setInterval(() => {
    let min = parseInt(x/60);
    let sec = x % 60;
    if (x >= 0) {
      minutes.textContent = min < 10 ? `0${min}` : min;
      seconds.textContent = sec < 10 ? `0${sec}` : sec;
      x--;
    } else {
      clearInterval(t);
      button.click();
    }
  },1000)
}
function checkValue(answer) {
  let inputs = document.querySelectorAll('input');
  for (let i = 0; i < inputs.length; i++){
    if (inputs[i].checked)
    {
    console.log('label '+inputs[i].nextElementSibling.textContent);
    console.log(answer);
    return inputs[i].nextElementSibling.textContent == answer;
    }
  }
}