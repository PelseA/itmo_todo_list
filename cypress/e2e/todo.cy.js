describe('Test - todo creation - on index page', () => {

  it('enter todo text and press create', () => {
    const TEST_TODO_TEXT = 'New todo';
    cy.checkInputExistAndEmpty();

    cy.get('#inpTodoTitle').type(TEST_TODO_TEXT);
    cy.get('#btnCreateTodo').click();

    cy.checkInputExistAndEmpty();
    const todoListChildren = cy.get('#listOfTodos').children();
    todoListChildren.should('exist').should('have.length',1);
    todoListChildren.first().should('contain.text', TEST_TODO_TEXT);
    const checkChildren = () => {
      cy.get('#listOfTodos input[type="checkbox"]').should('exist').should('have.length',1);
    }
    checkChildren();
    cy.reload(true);
    checkChildren();
  });

  it('enter todo text as number and check disable button', () => {

  });

  it('check empty input disable button', () => {

  });
});


