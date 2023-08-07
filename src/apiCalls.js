export const getOrders = () => {
  return fetch('http://localhost:3001/api/v1/orders').then((response) =>
    response.json()
  );
};

export const postOrder = (order) => {
  return fetch('http://localhost:3001/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(order),
  }).then((response) => response.json());
};

export const deleteOrder = (id) => {
  return fetch (`http://localhost:3001/api/v1/orders/${id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}
  }).then(response => response.status)
}