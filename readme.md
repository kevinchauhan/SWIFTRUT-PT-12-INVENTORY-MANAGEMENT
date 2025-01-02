# Inventory Management App

A full-stack application designed to manage inventory, products, and orders for an e-commerce platform. The app features functionalities like product management, order tracking, and admin controls for managing the product catalog and customer orders.

## Features

- **View Products**: Browse a list of available products with titles, descriptions, prices, and stock availability.
- **Create, Edit, and Delete Products**: Admin users can create new products, update existing ones, and remove them from the inventory.
- **Manage Orders**: Admin users can view all orders placed by customers, update order statuses, and manage stock levels.
- **Customer Cart**: Customers can add products to their cart, view their cart, and proceed to checkout.
- **User Authentication**: Secure login/signup functionality for customers and admins.

## Tech Stack

- **Frontend**:

  - React.js
  - TailwindCSS
  - Axios (HTTP Requests)
  - React Router (Routing)
  - Zustand (State Management)

- **Backend**:

  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JWT (Authentication)

## Endpoints

- **GET /api/products**: Fetch all products.
- **GET /api/products/:id**: Fetch a specific product by ID.
- **POST /api/products**: Create a new product (Admin only).
- **PUT /api/products/:id**: Update an existing product (Admin only).
- **DELETE /api/products/:id**: Delete a product (Admin only).
- **POST /api/orders**: Place a new order.
- **GET /api/orders**: Fetch all orders (Admin only).
- **PUT /api/orders/:id/status**: Update the status of an order (Admin only).

## Deployment

- Frontend: [https://swiftrut-pt-12-inventory-management.vercel.app](https://swiftrut-pt-12-inventory-management.vercel.app)
- Backend: [https://swiftrut-pt-12-inventory-management.onrender.com](https://swiftrut-pt-12-inventory-management.onrender.com)

## Contributing

Feel free to fork the repository, create an issue, or submit a pull request for bug fixes or new features.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
