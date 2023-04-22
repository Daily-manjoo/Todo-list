const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');

const savedTodoList = JSON.parse(localStorage.getItem('saved-items')) //키 가져오기(스트링형태->객체형태)



const createTodo = function (storageData){
    let todoContents = todoInput.value;
    if (storageData){
        todoContents = storageData.contents;
    }

    const newLi = document.createElement('li');
    const newSpan = document.createElement('span');
    const newBtn = document.createElement('button');
    
    newBtn.addEventListener('click', ()=> {
        newLi.classList.toggle('complete')
        saveItemsFn(); //버튼이 눌렸을때 한번 더 함수 실행
    });

    newLi.addEventListener('dblclick', () => {
        newLi.remove();
        
    });

    if(storageData.complete) {
        newLi.classList.add('complete'); //취소선 그어진 목록 그대로 반영 
    }


    newSpan.textContent = todoContents;
    newLi.appendChild(newBtn);
    newLi.appendChild(newSpan); //하위 노드 추가
    todoList.appendChild(newLi);
    todoInput.value = '';
    saveItemsFn();
    
}

const keyCodeCheck = function (){
    if(window.event.keyCode === 13 && todoInput.value){ //13은 엔터
        createTodo();
        
        
    }               
};

const deleteAll = function (){
    const liList = document.querySelectorAll('li');
    for (let i = 0; i < liList.length; i++){
        liList[i].remove();
    }
};

const saveItemsFn = function (){
    const saveItems = [];
    
    for(let i= 0; i < todoList.children.length; i++){
        const todoObj = {
            contents : todoList.children[i].querySelector('span').textContent,
            complete : todoList.children[i].classList.contains('complete'),
        };
        saveItems.push(todoObj);
    }

    localStorage.setItem('saved-items', JSON.stringify(saveItems)); //키,밸류
    
}

if (savedTodoList) {
    for(let i = 0; i <savedTodoList.length; i++){
        createTodo(savedTodoList[i])
    }
}
    