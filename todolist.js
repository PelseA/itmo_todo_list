/* build последовательно выполнили команды
npm i -g simple-server
yarn build
cd dist/
simple-server
* */
import TodoVO from './src/model/vos/TodoVO.js';
import { disableButtonWhenTextInvalid } from './src/utils/domUtils.js';
import { isStringNotNumberAndNotEmpty } from './src/utils/stringUtils.js';
import { localStorageListOf, localStorageSaveListOfWithKey } from './src/utils/databaseUtils.js';
import TodoView from './src/view/TodoView.js';

export function myTodoList(element) {
  const domInpTodoTitle = document.getElementById('inpTodoTitle');
  const domBtnCreateTodo = document.getElementById('btnCreateTodo');
  const domListOfTodos = document.getElementById('listOfTodos');

  // сохраняем ссылку на console.log в константу
  const debug = console.log;
  // перезаписываем функцию
  /*console.log = (msg, ...args) => {
    //if (import.meta.env.PROD === false) debug(msg);
    if (!import.meta.env.DEV) debug(msg, ...args);
  };*/
  // про переменные среды vite, например про import.meta.env., можно посмотреть в документации vite

  let selectedTodoVO = null;
  let selectedTodoViewItem = null;
  const hasSelectedTodo = () => !!selectedTodoVO;

  domBtnCreateTodo.addEventListener('click', onBtnCreateTodoClick);
  domInpTodoTitle.addEventListener('keyup', onInpTodoTitleKeyup);
  domListOfTodos.addEventListener('change', onTodoListChange);
  domListOfTodos.addEventListener('click', onTodoDomItemClicked);

  const LOCAL_LIST_OF_TODOS = 'listOfTodos';
  const LOCAL_INPUT_TEXT = 'inputText';

  const listOfTodos = localStorageListOf(LOCAL_LIST_OF_TODOS);

  console.log('> Initial value -> listOfTodos', listOfTodos);

  domInpTodoTitle.value = localStorage.getItem(LOCAL_INPUT_TEXT);
  render_TodoListInContainer(listOfTodos, domListOfTodos);
  disableOrEnable_CreateTodoButtonOnTodoInputTitle();

  //промисы Promise
  //после функции resolve сработает then, можно из then возвращать что-то
  //после функции reject сработает catch
  //finally опционально и не обязательно последний
  const delay = (time) =>
    new Promise((resolve, reject) => {
      console.log('>delay -> Promise created');
      setTimeout(() => {
        console.log('Promise setTimeOut');
        resolve(time);
        //resolve();
      }, time);
    });

  function onTodoDomItemClicked(event) {
    const domElement = event.target;
    if (!TodoView.isDomElementMatch(domElement)) return;

    const currentTodoVO = listOfTodos.find((vo) => vo.id === domElement.id);
    const isItemSelected = selectedTodoVO === currentTodoVO;

    if (hasSelectedTodo) resetSelectedTodo();

    if (!isItemSelected) {
      selectedTodoVO = currentTodoVO;
      selectedTodoViewItem = domElement;

      domBtnCreateTodo.innerText = 'Update';
      domInpTodoTitle.value = currentTodoVO.title;
      selectedTodoViewItem.style.backgroundColor = 'red';
      onInpTodoTitleKeyup();
    }
  }

  function onTodoListChange(event) {
    console.log('> onTodoListChange -> event:', event);
    const target = event.target;
    const index = target.id;
    if (index && typeof index === 'string') {
      const indexInt = parseInt(index.trim());
      const todoVO = listOfTodos[indexInt];
      console.log('> onTodoListChange -> todoVO:', indexInt, todoVO);
      todoVO.isCompleted = !!target.checked;
      save_ListOfTodo();
    }
  }

  //async - при каждом выполнении ф-я возвращает промис
  async function onBtnCreateTodoClick(event) {
    // console.log('> domBtnCreateTodo -> handle(click)', this.attributes);
    const todoTitle_Value_FromDomInput = domInpTodoTitle.value;
    // console.log('> domBtnCreateTodo -> todoInputTitleValue:', todoTitleValueFromDomInput);
    const isStringValid = isStringNotNumberAndNotEmpty(todoTitle_Value_FromDomInput);
    //await останавливает выполнение дальнейшего кода до выполнения promise
    if (isStringValid) {
      const result = await delay(1000).then((param) => {
        console.log('> param из resolve -> ', param);
        return {time: param * 2};
      });
      /*const result = await delay(1000)
        .then((param) => {
          console.log('> param из resolve -> ', param);
          return param ? param : 0;
        })
        .then((param) => {
          console.log('> param * 2 из resolve -> ', param * 2);
          return `time = ${param}`;
        });*/
      console.log('result -> ', result);
      //синтаксис, если не добавили к ф-ии async
      //delay(1000).then(() => {
      create_TodoFromTextAndAddToList(todoTitle_Value_FromDomInput, listOfTodos);
      clear_InputTextAndLocalStorage();
      save_ListOfTodo();
      render_TodoListInContainer(listOfTodos, domListOfTodos);
      disableOrEnable_CreateTodoButtonOnTodoInputTitle();
      //});
    }
  }

  function onInpTodoTitleKeyup() {
    // console.log('> onInpTodoTitleKeyup:', event);
    const inputValue = domInpTodoTitle.value;
    // console.log('> onInpTodoTitleKeyup:', inputValue);
    if (hasSelectedTodo()) {
      disableOrEnable_CreateTodoButtonOnTodoInputTitle(() => {
        return isStringNotNumberAndNotEmpty(inputValue) && selectedTodoVO.title !== inputValue;
      });
    } else {
      localStorage.setItem(LOCAL_INPUT_TEXT, inputValue);
      disableOrEnable_CreateTodoButtonOnTodoInputTitle();
    }
  }

  function render_TodoListInContainer(listOfTodoVO, container) {
    let output = '';
    let todoVO;
    for (let index in listOfTodoVO) {
      todoVO = listOfTodoVO[index];
      output += TodoView.createSimpleViewFromVO(index, todoVO);
    }
    container.innerHTML = output;
  }

  function resetSelectedTodo() {
    console.log('> resetSelectedTodo -> selectedTodoVO:', selectedTodoVO);
    domBtnCreateTodo.innerText = 'Create';
    domInpTodoTitle.value = localStorage.getItem(LOCAL_INPUT_TEXT);
    if (selectedTodoViewItem) selectedTodoViewItem.style.backgroundColor = '';
    selectedTodoVO = null;
    selectedTodoViewItem = null;
    disableOrEnable_CreateTodoButtonOnTodoInputTitle();
  }

  function create_TodoFromTextAndAddToList(input, listOfTodos) {
    console.log('> create_TodoFromTextAndAddToList -> input =', input);
    listOfTodos.push(TodoVO.createFromTitle(input));
  }

  function clear_InputTextAndLocalStorage() {
    domInpTodoTitle.value = '';
    localStorage.removeItem(LOCAL_INPUT_TEXT);
  }

  function disableOrEnable_CreateTodoButtonOnTodoInputTitle(validateInputMethod = isStringNotNumberAndNotEmpty) {
    console.log('> disableOrEnableCreateTodoButtonOnTodoInputTitle -> domInpTodoTitle.value =', domInpTodoTitle.value);
    const textToValidate = domInpTodoTitle.value;
    disableButtonWhenTextInvalid(domBtnCreateTodo, textToValidate, validateInputMethod);
  }

  function save_ListOfTodo() {
    localStorageSaveListOfWithKey(LOCAL_LIST_OF_TODOS, listOfTodos);
  }
}
