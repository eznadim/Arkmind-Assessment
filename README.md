# Interview Task: Full Stack Application Development
## Objective
Your task is to create a full-stack application for managing "items." The project consists of a backend API built with Express.js and TypeScript and a frontend application using React.js with Redux Toolkit.

This exercise will help us evaluate your skills in backend development, API design, frontend integration, and state management.

## Instructions
### Backend Requirements
1. Database Integration:

- Use MySQL as the database.
- Create an items table with the following schema:
- id (Primary Key, Auto-increment)
- name (String, required, max length: 100 characters)
- description (String, optional, max length: 500 characters)
- price (Decimal, required, must be positive)
- createdAt (Timestamp, default to current timestamp)
- updatedAt (Timestamp, updated on modification)

2. Endpoints:
- Implement the following CRUD operations:
- POST /api/items - Create a new item.
- GET /api/items - Get all items.
- GET /api/items/:id - Get an item by its id.
- PUT /api/items/:id - Update an existing item by its id.
- DELETE /api/items/:id - Delete an item by its id.

3. Validation:
- Use a validation library (e.g., Zod or Joi) to validate incoming requests.

4. Code Organization:
- Use a modular and scalable project structure.

### Frontend Requirements
1. Features:
- A single-page application to:
- Create Item: A form to add a new item.
- View All Items: A table or list to display all items.
- Edit Item: A form pre-filled with item details to update.
- Delete Item: A button to delete an item with confirmation.

2. API Integration:
- Use Axios  to interact with the backend.

3. State Management:
- Use Redux Toolkit for global state management.

4. UI/UX:
- Build a responsive and user-friendly interface using any library (e.g., Ant Design, or TailwindCSS).

## Deliverables
### Backend:
- A GitHub repository containing the Express.js backend with TypeScript.
Include instructions to set up and run the backend.

### Frontend:
- A GitHub repository containing the React.js frontend with Redux Toolkit.
- Include instructions to set up and run the frontend.

### README:
- Provide a README.md file for each repository with:
- Setup instructions.
- API endpoint details.
- Any additional notes (e.g., known issues, future enhancements).
