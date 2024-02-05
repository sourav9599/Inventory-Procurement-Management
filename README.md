# Inventory and Procurement Management System for OIL Rigs

This project is a full-stack inventory and procurement management system for oil rigs. It consists of a frontend built using React and a backend built using Spring Boot 3.

## Frontend

### Prerequisites:

- Node.js version 16 or later
- npm version 7 or later

### Setup:

1. Clone the repository:

```
git clone https://github.com/YOUR_USERNAME/inventory-procurement-management-system.git
```

2. Navigate to the frontend directory:

```
cd frontend
```

3. Install dependencies:

```
npm install
```

4. Run the development server:

```
npm start
```

### Usage:

The frontend application will be available at http://localhost:3000.

## Backend

### Prerequisites:

- Java 17 or later
- Gradle version 7 or later

### Setup:

1. Clone the repository:

```
git clone https://github.com/YOUR_USERNAME/inventory-procurement-management-system.git
```

2. Navigate to the backend directory:

```
cd backend
```

3. Import the project into your IDE (e.g., IntelliJ IDEA).
4. Build the project:

```
gradle build
```

### Usage:

To run the backend application, execute the following command:

```
gradle bootRun
```

The backend application will be available at http://localhost:8080.

## AWS Services

This project uses the following AWS services:

- Amazon Cognito: For authentication and authorization.
- Amazon DynamoDB: For storing data.
- Amazon SNS: For sending emails.
- Amazon S3: For storing files.

### Configuration

To configure the AWS services, follow the instructions in the `application.properties` file.

## Database

This project uses AWS DynamoDB as the database. To create the necessary tables, run the following command:

```
gradle dynamoDbCreateTables
```

## Email

This project uses Amazon SES to send emails.

## File Storage

This project uses Amazon S3 to store files.

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.
