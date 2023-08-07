describe("homepage spec", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:3001/api/v1/orders", {
      statusCode: 200,
      fixture: 'initialGet',
    }).as('initialGet')
    cy.visit("http://localhost:3000").wait('@initialGet')
  })
  it("should load a page with a title, form, submit button, and fetched orders", () => {
    cy.get('h1').should('contain', 'Burrito Builder')
    const possibleIngredients = [
      'beans',
      'steak',
      'carnitas',
      'sofritas',
      'lettuce',
      'queso fresco',
      'pico de gallo',
      'hot sauce',
      'guacamole',
      'jalapenos',
      'cilantro',
      'sour cream',
    ];
    possibleIngredients.forEach(ingredient => {
      cy.get(`button[name="${ingredient}"]`).should('contain', `${ingredient}`)
    })
  });
});
