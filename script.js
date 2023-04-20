const todoInput = document.querySelector('#todo-input');

const createTodo = function (){
    const todoList = document.querySelector('#todo-list');
    const newLi = document.createElement('li');
    const newSpan = document.createElement('span');
    const newBtn = document.createElement('button');
    
    newBtn.addEventListener('click', ()=> {
        newLi.classList.toggle('complete')
    })

    newSpan.textContent = todoInput.value;
    newLi.appendChild(newBtn);
    newLi.appendChild(newSpan); //하위 노드 추가
    todoList.appendChild(newLi);
    console.log(newLi);
    todoInput.value = '';
}

const keyCodeCheck = function (){
    if(window.event.keyCode === 13 && todoInput.value){ //13은 엔터
        createTodo();
        
        
    }               
}; 
    