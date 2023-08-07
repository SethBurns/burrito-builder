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
    cy.get('.order').eq(0).find('h3').should('contain', 'Pat')
    cy.get('.order').eq(2).find('h3').should('contain', 'Alex')
  });
  it('should allow a user to add their name and ingredients to an order, submit it, and see it on the DOM', () => {
    cy.get('input[type="text"]').type('Seth')
    cy.get('input[type="text"]').should('have.value', 'Seth')
    cy.get('button[name="carnitas"]').click()
    cy.get('button[name="pico de gallo"]').click()
    cy.get('button[name="beans"]').click()
    cy.get('button[name="queso fresco"]').click()
    cy.get('form').find('p').should('contain', 'Order: carnitas, pico de gallo, beans, queso fresco')
    cy.intercept('POST', 'http://localhost:3001/api/v1/orders', (req) => {
      req.body = {
        name: "Seth",
        ingredients: ['carnitas', 'pico de gallo', 'beans', 'queso fresco']
      };
      req.reply({
        statusCode: 201,
        fixture: 'postResponse'
      })
    }).as('postResponse')
    cy.get('form').contains('button', 'Submit Order').click()
    cy.wait('@postResponse').its('response.statusCode').should('eq', 201)
    // I know waiting an arbitrary amount of time is insane, but my test fails without it even though I'm waiting for my stubbed response.
    cy.wait(1000)
    // If I don't wait, the div at index 3 isn't there yet. I can't figure out why.
    cy.get('section').find('div').eq(3).find('h3').should('contain', 'Seth')
  });
  it('should not allow the submit button to be pressed unless a name and at least one ingredient is selected', () => {
    cy.get('form').contains('button', 'Submit Order').click()
    cy.get('.error').should('contain', 'You must fill out Name AND Ingredients.')
    cy.get('section').find('div').last().find('h3').should('contain', 'Alex')
    cy.get('input[type="text"]').type('Seth')
    cy.get('form').contains('button', 'Submit Order').click()
    cy.get('.error').should('contain', 'You must fill out Name AND Ingredients.')
    cy.get('section').find('div').last().find('h3').should('contain', 'Alex')
    cy.get('input[type="text"]').clear()
    cy.get('button[name="cilantro"]').click()
    cy.get('form').contains('button', 'Submit Order').click()
    cy.get('.error').should('contain', 'You must fill out Name AND Ingredients.')
    cy.get('section').find('div').last().find('h3').should('contain', 'Alex')
  })
});
