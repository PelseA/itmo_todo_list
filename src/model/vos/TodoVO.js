// именование класса, содержащего <модель данных без методов> имеет постфикс 'VO'
class TodoVO {
  static createFromTitle(title) {
    const todoId = Date.now().toString();
    return new TodoVO(todoId, title);
  }
  constructor(id, title, date = new Date()) {
    this.id = id;
    this.title = title;
    this.date = date;
    /*this.date = {
                  creation: date,
                  update: date
              };*/
    this.isCompleted = false;
  }


}
export default TodoVO;
