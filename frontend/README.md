Frontend Setting up:
1. Check environment.env file. Make sure the url and port is the same as backend [app.ts]
2. Run command "npm i" to install dependencies. Run another command "npm install antd @ant-design/icon" to install UI/UX library.
3. To run our frontend, run command "npm run dev". This is because we are doing development-specific tasks.

API Endpoints Details:
- Frontend uses axios to connect backend API to frontend [api.ts]
- Frontend uses Redux Toolkit to improve readability of code and easier to maintain [itemSlice.ts]

Future enhancements:
- As this is my first proper project using Redux Toolkit, there are lots of ways to improve in terms of scalability and efficient-wise.
- Other improvements that can be done are proper UI/UX with more clarity, better placement and user-friendly for user.
