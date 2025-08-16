# Yaqeen-Clothing

## Install dependencies

Clone the repository and install dependencies for both backend & frontend:

```bash
git clone https://github.com/maryamhelal/Yaqeen-Clothing.git
```

```bash
cd Yaqeen-Clothing
```

```bash
npm run install-all
```

#### Example .env for the backend folder

```bash
PORT = 5000
MONGO_URI=your_mongo_link
JWT_SECRET=secret-jwt-token
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

## Running the app

### Backend + Frontend

```bash
npm start
```

- You can access the application by going to [http://localhost:3000](http://localhost:3000) in your browser.
- You can access the swagger ui by going to [http://localhost:5000/api-docs](http://localhost:5000/api-docs) in your browser.

### Using Docker

```bash
docker compose up -d
```
