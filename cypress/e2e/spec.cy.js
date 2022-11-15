describe('empty spec', () => {
  before(() => {
    cy.visit('http://localhost:8081');
  });

  it('goto index page enter todo text and press create', () => {
    const TEST_TODO_TEXT = 'New Todo';

    cy.get('body').then(() => {});
    cy.get('#inpTodoTitle').should('exist').should('contain.text', '').type(TEST_TODO_TEXT);
    cy.get('#btnCreateTodo').click();
    cy.get('#listOfTodos').should('contain.text', TEST_TODO_TEXT);
  });
});