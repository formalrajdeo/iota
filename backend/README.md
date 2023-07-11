# [iota.io](https://localhost:5000/)

This project is about authentication.

## Running Locally

### Cloning the repository the local machine.

```bash
git clone
```

### Configure .env file.

Create a file in root directory of project with env. And store your configurations in it, as shown in the .example.env file.

### Migrations - create database(iota)

```
copy & paste sql queries from => migrations/create.sql file.
```

### Installing the dependencies.

```bash
npm install
```

### Running the application.

Then, run the application in the command line and it will be available at `http://localhost:5000`.

```bash
npm run dev
```

### Postman [docs](https://documenter.getpostman.com/view/13755912/2s946bCabc)

```
https://documenter.getpostman.com/view/13755912/2s946bCabc
```

### Sample credentials for testing by login

| email | password | isAdmin
| -------------------- | -------------------- | ------
| admin@example.com | Admin@123 | true
| user@example.com | User@123 | false


