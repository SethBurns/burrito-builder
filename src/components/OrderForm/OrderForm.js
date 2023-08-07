import { useEffect, useState } from 'react';
import './OrderForm.css';
import { postOrder } from '../../apiCalls';

function OrderForm({ setOrders, orders }) {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [formFilled, setFormFilled] = useState(false);
  const [formError, setFormError] = useState(false);

  useEffect(() => {
    if (name.length && ingredients.length) {
      setFormFilled(true);
    } else {
      setFormFilled(false);
    }
  }, [name, ingredients]);

  useEffect(() => {
    if (formError) {
      setTimeout(() => {
        setFormError(false);
      }, 4000);
    }
  }, [formError]);

  function handleSubmit(e) {
    e.preventDefault();
    if (formFilled) {
      let order = {
        name: name,
        ingredients: ingredients,
      };
      postOrder(order)
        .then((response) => {
          setOrders([...orders, response]);
          clearInputs();
        })
        .catch((err) => console.log(err));
    } else {
      setFormError(true);
    }
  }

  function clearInputs() {
    setName('');
    setIngredients([]);
  }

  function handleIngredientClick(e, ingredient) {
    e.preventDefault();
    setIngredients([...ingredients, ingredient]);
    console.log(ingredient, ingredients);
  }

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
  const ingredientButtons = possibleIngredients.map((ingredient) => {
    return (
      <button
        key={ingredient}
        name={ingredient}
        onClick={(e) => {
          handleIngredientClick(e, ingredient);
        }}
      >
        {ingredient}
      </button>
    );
  });

  return (
    <form>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />

      {ingredientButtons}
      {formError && (
        <p className="error">You must fill out Name AND Ingredients.</p>
      )}
      <p>Order: {ingredients.join(', ') || 'Nothing selected'}</p>

      <button onClick={(e) => handleSubmit(e)}>Submit Order</button>
    </form>
  );
}

export default OrderForm;
