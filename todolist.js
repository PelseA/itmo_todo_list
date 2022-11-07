import TodoVO from './src/model/vos/TodoVO.js';
import { disabledButtonWhenTextInvalid } from './src/utils/domUtils.js';
import { isStringNotNumberAndNotEmpty } from './src/utils/stringUtils.js';
import { localStorageListOf } from './src/utils/databaseUtils.js';
import TodoView from './src/view/TodoView.js';

export function myTodoList(element) {
  const domInpTodoTitle = document.getElementById('inpTodoTitle');
  const domBtnCreateTodo = document.getElementById('btnCreateTodo');
  const domListOfTodos = document.getElementById('listOfTodos');
  domBtnCreateTodo.addEventListener('click',  onBtnCreateOrUpdateTodoClick);
  //domInpTodoTitle.addEventListener('input',  ifTitleChanges);
  domInpTodoTitle.addEventListener('keyup', onInpTodoTitleKeyup);
  domListOfTodos.addEventListener('change', onTodoListChange);
  domListOfTodos.addEventListener('click', chooseOneFromTheList);
  let selectedTodoVO = null;
  let selectedTodoTitle = null;
  const LOCAL_LIST_OF_TODOS = 'listOfTodos';
  const LOCAL_INPUT_TEXT = 'inputText';
  //если данные еще не существуют в хранилище, то создаем пустой массив для них
  let listOfTodos = localStorageListOf(LOCAL_LIST_OF_TODOS);

  domInpTodoTitle.value = localStorage.getItem(LOCAL_INPUT_TEXT);
  render_TodoListInContainer(listOfTodos, domListOfTodos);
  disableOrEnable_CreateTodoButtonOnTodoInputTitle();

  function chooseOneFromTheList (event) {
    removeWarningTip();
    if (selectedTodoVO == null) {
      const todoID = event.target.id;
      const todoVO = listOfTodos.find((item) => item.id === todoID);
      domInpTodoTitle.value = todoVO.title;
      selectedTodoTitle = todoVO.title;
      selectedTodoVO = todoVO;
      event.target.style.border = '1px solid red';
      event.target.style.backgroundColor = "lightgrey";
      domBtnCreateTodo.innerText = 'UPDATE';
    } else {
      if (event.target.style.border === '1px solid red') {
        resetSelectedTodo();
        domInpTodoTitle.value = '';
        domBtnCreateTodo.innerText = 'Create';
      }
    }
  }

  /*
  * произвести действия, если пользователь начал изменения в названии
  * */
  function ifTitleChanges() {
    if (selectedTodoTitle) {
      if (domBtnCreateTodo && domInpTodoTitle.value && selectedTodoTitle === domInpTodoTitle.value) {
        domBtnCreateTodo.disabled = true;
        createWarningTip('Вы можете редактировать название');
      } else {
        removeWarningTip();
        domBtnCreateTodo.disabled = false;
      }
    }
  }

  //заполнение чекбокса: выполнено, не выполнено
  function onTodoListChange(event){
    console.log(event.target)
    const target = event.target;
    const index = target.id;
    if (index && typeof index === 'string') {
      const indexInt = parseInt(index.trim());
      const todoVO = listOfTodos[index];
      todoVO.isCompleted = !!target.checked;
      save_ListOfTodo();
    }
  }

  function createTodoVO(title) {
    const todoId = Date.now().toString();
    return new TodoVO(todoId, title);
  }

  function createFromTitle(todoTitleValueFromDomInput) {
    return undefined;
  }

  function removeWarningTip() {
    if (document.getElementById('warningTip')) {
      document.getElementById('warningTip').parentNode.remove();
    }
  }

  function createWarningTip(textTip) {
    if (document.getElementById('warningTip')) {
      if (textTip !== document.getElementById('warningTip').innerText) removeWarningTip();
      if (!document.getElementById('warningTip')) insertWarning(textTip);
      else document.getElementById('warningTip').style.color = document.getElementById('warningTip').style.color === 'red' ? 'blue' : 'red';
    } else insertWarning(textTip);
  }

  function insertWarning(textTip) {
    let paragraphForNB = document.createElement("div");
    paragraphForNB.innerHTML = "<p id='warningTip' style='color: red;'>" + textTip + "</p>";
    let inputParentNode = domInpTodoTitle.parentNode;
    inputParentNode.insertBefore(paragraphForNB, domInpTodoTitle);
  }

  function onBtnCreateOrUpdateTodoClick() {
    if (selectedTodoTitle) {

      if (domBtnCreateTodo && domInpTodoTitle.value && selectedTodoTitle === domInpTodoTitle.value) {
        console.log(1900)
        createWarningTip('Редактируйте название');
        domBtnCreateTodo.disabled = true;
      } else {
        removeWarningTip();
        domBtnCreateTodo.disabled = false;
        const todoTitleValueFromDomInput = domInpTodoTitle.value;
        if (todoTitleValueFromDomInput === '') {
          createWarningTip('Введите название');
        } else if (/^(\s+)?\d+(\s+)?$/.test(todoTitleValueFromDomInput.trim())) {
          createWarningTip('Название дела не может состоять только из числа');
        } else {
          if (isStringNotNumberAndNotEmpty(todoTitleValueFromDomInput)) {
            if (selectedTodoVO) {
              selectedTodoVO.title = todoTitleValueFromDomInput;
              selectedTodoVO = null;
            }
            else create_TodoFromTextAndAddToList(todoTitleValueFromDomInput, listOfTodos);
          }
          removeWarningTip();
          domBtnCreateTodo.innerText = 'Create';
          save_ListOfTodo();
          clear_InputTextAndLocalStorage();
          render_TodoListInContainer(listOfTodos, domListOfTodos);
          disableOrEnable_CreateTodoButtonOnTodoInputTitle();
        }
      }
    }
  }

  function onInpTodoTitleKeyup(event) {
    const inputValue = domInpTodoTitle.value;
    disableOrEnable_CreateTodoButtonOnTodoInputTitle();
    localStorage.setItem(LOCAL_INPUT_TEXT, inputValue);
  }

  function render_TodoListInContainer(listOfTodoVO, container) {
    let todoVO;
    let output = '';
    console.log(listOfTodoVO)
    for (let index in listOfTodoVO) {
      todoVO = listOfTodoVO[index];
      output += TodoView.createSimpleViewFromVO(todoVO, todoVO);
    }
    container.innerHTML = output;
  }

  function disableOrEnable_CreateTodoButtonOnTodoInputTitle() {
    const textToValidate = domInpTodoTitle.value;
    disabledButtonWhenTextInvalid(domBtnCreateTodo, textToValidate, isStringNotNumberAndNotEmpty);
  }

  function clear_InputTextAndLocalStorage() {
    domInpTodoTitle.value = '';
    localStorage.removeItem(LOCAL_INPUT_TEXT);
  }

  function save_ListOfTodo() {
    localStorage.setItem(LOCAL_LIST_OF_TODOS, JSON.stringify(listOfTodos));
  }

  function create_TodoFromTextAndAddToList(input, listOfTodos) {
    const newTodoVO = TodoVO.createFromTitle(input);
    listOfTodos.push(newTodoVO);
  }

  function resetSelectedTodo(event) {
    selectedTodoVO = null;
    domBtnCreateTodo.innerText = 'Create';
    domInpTodoTitle.value = localStorage.getItem(LOCAL_INPUT_TEXT);
    event.target.removeAttribute("style");
  }
}
