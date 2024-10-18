# therapy-scheduler

## Description
This is a Vue web application supported by a Node.js + Express.js backend with an SQLite database. The purpose of this application is for therapists and clients to book sessions to meet together. It allows therapists to create sessions, clients to decide when this session should happen and for both personnel to edit/cancel these sessions.

## Running the app
Follow the steps below to run the app locally:

1. Clone the repository

```git clone https://github.com/calvingiese/therapy-scheduler.git therapy-scheduler```

2. Start the backend server (from the root of the project)

```
  cd api
  npm install
  node server.js
```

3. Start the web app (from the root of the project)

```
  cd web
  npm install
  npm run serve
```

4. Visit the app at `http://localhost:8080/login`

## Testing the app
1. Backend (from the root of the project)

```
  cd api
  npx test
```

3. Web (from the root of the project)

```
  cd web
  npx cypress run
```
