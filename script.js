const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');

const savedTodoList = JSON.parse(localStorage.getItem('saved-items')); //키 가져오기(스트링형태->객체형태)
const savedWeatherData = JSON.parse(localStorage.getItem('saved-weather'));

const createTodo = function (storageData) {
  let todoContents = todoInput.value;
  if (storageData) {
    todoContents = storageData.contents;
  }

  const newLi = document.createElement('li');
  const newSpan = document.createElement('span');
  const newBtn = document.createElement('button');

  newBtn.addEventListener('click', () => {
    newLi.classList.toggle('complete');
    saveItemsFn(); //버튼이 눌렸을때 한번 더 함수 실행
  });

  newLi.addEventListener('dblclick', () => {
    newLi.remove();
    saveItemsFn();
  });

  if (storageData?.complete) {
    //옵셔널체이닝: 스토리지데이터가 실제 존재할때만 complete 찾기
    newLi.classList.add('complete'); //취소선 그어진 목록 새로고침시 그대로 반영
  }

  newSpan.textContent = todoContents;
  newLi.appendChild(newBtn);
  newLi.appendChild(newSpan); //하위 노드 추가
  todoList.appendChild(newLi);
  todoInput.value = '';
  saveItemsFn();
};

const keyCodeCheck = function () {
  if (window.event.keyCode === 13 && todoInput.value.trim() !== '') {
    //13은 엔터, trim은 공백 없애줌
    createTodo();
  }
};

const deleteAll = function () {
  const liList = document.querySelectorAll('li');
  for (let i = 0; i < liList.length; i++) {
    liList[i].remove();
  }
  saveItemsFn();
};

const saveItemsFn = function () {
  const saveItems = [];

  for (let i = 0; i < todoList.children.length; i++) {
    const todoObj = {
      contents: todoList.children[i].querySelector('span').textContent,
      complete: todoList.children[i].classList.contains('complete'),
    };
    saveItems.push(todoObj);
  }

  saveItems.length === 0
    ? localStorage.removeItem('saved-items')
    : localStorage.setItem('saved-items', JSON.stringify(saveItems));
};

if (savedTodoList) {
  for (let i = 0; i < savedTodoList.length; i++) {
    createTodo(savedTodoList[i]);
  }
}

const weatherDataActive = function ({ location, weather }) {
  const weatherMainList = ['Clear', 'Clouds', 'Drizzle', 'Rain', 'Snow', 'Thunderstorm'];
  //weather가 이 배열에 없다면 아랫줄 weather에 fog로 재할당
  weather = weatherMainList.includes(weather) ? weather : 'Fog'; //배열에 해당 요소가 있는지 체크하는 메소드includes
  const locationNameTag = document.querySelector('#location-name-tag');
  locationNameTag.textContent = location;
  document.body.style.backgroundImage = `url('./images/${weather}.jpg')`;

  if (!savedWeatherData || savedWeatherData.location !== location || savedWeatherData.weather !== weather) {
    //통신을 통해 과거에 받아온 데이터와 현재 받아온 데이터가 같지 않다면
    localStorage.setItem('saved-weather', JSON.stringify({ location, weather }));
  }
};

const weatherSearch = function (position) {
  //position도 latitude, longitude로 구조분해할당 가능. 아랫줄 position.latitude가 아니라 latitude만 써도 됨
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=7a940c40f2bbdfd8cbac5abf9a4bb2a6`
  )
    .then(res => {
      // JSON.parse() 바디+헤더 존재할때 json으로 받고 바디만 존재할땐 parse()
      return res.json();
    })
    .then(json => {
      //then을 리턴하면 한번 더 then을 쓸 수 있음
      const weatherData = {
        location: json.name,
        weather: json.weather[0].name,
      };
      weatherDataActive(weatherData);
    })
    .catch(err => {
      //에러가 발생할 경우
      console.error(err);
    });
}; // fetch는 api를 요청할떄 쓰는 함수

const accessToGeo = function ({ coords }) {
  // position 객체 안의 coord 바로 뽑아오는 구조분해할당
  const { latitude, longitude } = coords;
  const positionObj = {
    latitude, //latitude: latitude 이라면 latitude만 입력해도 가능(shorthand property)
    longitude,
  };
  weatherSearch(positionObj);
};

const askForLocation = function () {
  navigator.geolocation.getCurrentPosition(accessToGeo, err => {
    console.log(err);
  });
};
askForLocation();

if (savedWeatherData) {
  weatherDataActive(savedWeatherData);
}
