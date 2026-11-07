OPTIONAL SERVER VERSION (REQUIRES INSTALLATIONS)
This is included as source code for your project submission. It is NOT needed for the
double-click browser edition.

Requirements:
- Node.js
- MySQL Server

Steps:
1. Start MySQL.
2. Open MySQL Workbench or MySQL command line.
3. Run database/schema.sql.
4. In backend/server.js, set the MySQL password if your root account has one.
5. Open terminal in the backend folder.
6. Run: npm install
7. Run: npm start
8. Open: http://localhost:3000

The API routes included:
GET/POST/PUT/DELETE /api/transactions
GET/POST/DELETE      /api/categories
GET/POST/DELETE      /api/budgets
GET                  /api/health

Note: The no-install frontend edition uses browser localStorage so that opening index.html
works without a server. The included Express backend is a separate server-enabled version.
