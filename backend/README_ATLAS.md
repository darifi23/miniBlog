Connecting to MongoDB Atlas

1. Create a free MongoDB Atlas cluster at https://cloud.mongodb.com.
2. Create a database user and note the username and password.
3. Whitelist your IP address (or 0.0.0.0/0 for development) in Network Access.
4. Get the connection string and replace the placeholders:

   mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority

5. Edit `backend/.env` and set `MONGO_URI` to your connection string.

6. Restart the backend server:

```powershell
cd backend
npm run dev
```

7. Verify connection in backend logs. You should see "MongoDB Connected successfully".

Security notes:
- Do NOT commit your real `.env` with credentials to version control.
- For production, use environment variables provided by your hosting platform or a secrets manager.
