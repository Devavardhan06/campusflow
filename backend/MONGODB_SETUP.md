# MongoDB setup for CampusFlow

The app needs a running MongoDB. You can use **MongoDB Atlas** (cloud, free tier) or **MongoDB locally**.

## Option 1: MongoDB Atlas (recommended, no local install)

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a **free cluster** (e.g. M0).
3. Under **Database Access** → Add Database User: create a user and password (remember them).
4. Under **Network Access** → Add IP Address: add `0.0.0.0/0` (allow from anywhere) or your current IP.
5. In **Database** → **Connect** → **Drivers**: copy the connection string. It looks like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user and password (encode special characters in the password, e.g. `@` → `%40`).
7. In the project’s `backend` folder, edit `.env` and set:
   ```env
   MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   DATABASE_NAME=campusflow
   ```
8. Restart the backend; it should connect and you can use login/register.

## Option 2: MongoDB running locally

1. Install MongoDB:
   - **macOS (Homebrew):** `brew tap mongodb/brew && brew install mongodb-community`  
     Then start: `brew services start mongodb-community`
   - **Windows:** [Install MongoDB Community](https://www.mongodb.com/docs/manual/administration/install-community/)
   - **Linux:** [Install MongoDB Community](https://www.mongodb.com/docs/manual/administration/install-on-linux/)
2. Keep `.env` as:
   ```env
   MONGO_URI=mongodb://localhost:27017
   DATABASE_NAME=campusflow
   ```
3. Restart the backend.

After MongoDB is reachable, run the backend again; the 500 on login/register should go away.
