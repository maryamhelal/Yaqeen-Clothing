# Yaqeen-Clothing

## Install dependencies

Clone the repository and install dependencies for both backend and frontend:

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
PORT=5000
MONGO_URI=your_mongo_link
JWT_SECRET=secret-jwt-token
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
```

## Running the app

### Locally

```bash
npm start
```

### Using Docker

start containers:

```bash
docker compose up -d
```

stop containers:

```bash
docker compose down
```

### Services

- **Frontend**: Runs on port 3000, accessible at [http://localhost:3000](http://localhost:3000)
- **Backend**: Runs on port 5000, accessible at [http://localhost:5000](http://localhost:5000)
- **Swagger UI**: Runs on port 5000, accessible at [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
