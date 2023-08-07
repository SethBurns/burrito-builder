import React from "react";
import "./Orders.css";
import { deleteOrder } from "../../apiCalls";

const Orders = ({orders, setOrders}) => {

  function handleDelete(e, id) {
    e.preventDefault();
    deleteOrder(id).then(data => {
      if(data === 204) {
        let delOrd = orders.findIndex(order => order.id === id)
        if (delOrd !== -1) {
          let clone = orders.slice()
          clone.splice(delOrd, 1)
          setOrders(clone)
        }
      }}).catch(err => console.log(err))
  }


  const orderEls = orders.map((order) => {
    return (
      <div key={order.id} className="order" >
        <h3>{order.name}{order.id}</h3>
        <ul className="ingredient-list">
          {order.ingredients.map((ingredient) => {
            return <li key={ingredient}>{ingredient}</li>;
          })}
        </ul>
        <button className="deleteOrder" onClick={(e) => {handleDelete(e, order.id)}} >🗑️</button>
      </div>
    );
  });

  return (
    <section>{orderEls.length ? orderEls : <p>No orders yet!</p>}</section>
  );
};

export default Orders;
