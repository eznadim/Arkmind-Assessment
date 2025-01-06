Backend Setting up:
1. First, connect with your database. Go to environment.env and database.ts to change your parameter based on your MySQL credential.
2. Check if your MySQL services are running then proceed to create your database and your table. Following is an example of sequence of query.
```
  CREATE DATABASE item_management;
  USE DATABASE item_management;
  CREATE TABLE items ( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    description VARCHAR(500), 
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0), 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP );
```
3. Next, run command "npm i" at backend path. This is to install necessary dependencies to run our backend setup.
4. To run our backend, run command "npm run dev". This is because we are doing development-specific tasks.

API Endpoint Details:
- If you go to item.service.ts, we are using simple CRUD (Create, Read, Update, Delete) functions. [getAllItems,getItemById,createItem,updateItem,deleteItem]
- We are also using Zod for our validation library.

Further enhancements:
- Things that can be further enhance are optimizations in terms of coding and scalability. As this is my first proper project regarding this technology, my coding may still be immature and can still be improve.
- Other than that, different functions can be added to this simple CRUD function such as Filters through inputs, Filters through text, uploading pictures or files and a simple login/logout for user.
