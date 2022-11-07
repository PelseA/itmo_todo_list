class TodoView {
  static createSimpleViewFromVO(index, vo) {
    return `
      <li id='${vo.id}'>
        <!-- <input type="checkbox" data-todoIndex="${index}">${vo.title} -->
        <input type="checkbox" id="${index}">${vo.title}
      </li>
    `;
  }
}

export default TodoView