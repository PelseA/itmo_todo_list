class TodoView {
  static TODO_VIEW_ITEM = 'todoItem';

  static isDomElementMatch(domElement) {
    return domElement.dataset.type === TodoView.TODO_VIEW_ITEM;
  }

  static createSimpleViewFromVO(index, vo) {

    const checked = vo.isComplited ? 'checked' : '';
    return `<li style="user-select: none; width: 100%;" 
              data-type="${TodoView.TODO_VIEW_ITEM}"
               id="${vo.id}">
        <input type="checkbox" id="${index}"${checked}>${vo.title}
    </li>`;
  }
}

export default TodoView;