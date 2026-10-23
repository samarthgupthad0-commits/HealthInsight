# HealthInsight

HealthInsight is a React application for exploring medication recommendations based on reported symptoms and health history. Recommendations are simulated for demonstration purposes and are not medical advice.

## Requirements

- Node.js and npm
- MongoDB, for backend consultation storage

## Run the application

Start the backend in one terminal:

```powershell
cd healthinsight-backend
npm install
Copy-Item .env.example .env
npm start
```

Start the frontend in another terminal:

```powershell
cd Health-Insight-Frontend
npm install
npm start
```

The frontend is available at <http://localhost:3000>. The backend health check is at <http://localhost:5000/api/health>. Configure `MONGODB_URI` and `JWT_SECRET` in the backend's local `.env` file as needed. Do not commit `.env` files or real credentials.

The medication recommendations page includes an option to download a printable HTML copy if the browser does not support printing directly.
