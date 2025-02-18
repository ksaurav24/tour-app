# Tour-App

Tour-App is a web application designed for solo travelers who want to connect with others and find travel companions. It allows users to list their own trips and join trips created by other travelers, making it easier to find travel buddies and explore the world together.

## Features

- **Create Trips**: Users can list their planned trips, including destinations, dates, and activities.
- **Join Trips**: Travelers can browse and join trips created by others.
- **User Profiles**: Personalized profiles showcase travel preferences and experiences.
- **Trip Reviews**: Share experiences and rate trips after completion.

## Client

The client-side of Tour-App is currently under development. I am working on creating an intuitive and user-friendly interface to enhance the travel planning and connection experience.

## Server

The server-side of Tour-App is built using Node.js and Express.js framework, providing a robust backend to support the application's features.

### Prerequisites

- Node.js (version 12 or higher)
- npm (Node Package Manager)
- MongoDB 

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ksaurav24/tourApp.git
   cd tour-app
   ```

2. Set up environment variables:
   - Locate the `.env.sample` file in the project root
   - Create a new file named `.env`
   - Copy the contents from the sample file to your new `.env` file
   - Update the variables with your specific configuration (e.g., database connection, Secrets)

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start both the client and server:
```bash
npm start
```

For development mode:
```bash
npm run dev
```

To run only the server:
```bash
npm run server
```

The server should now be running and accessible at `http://localhost:<YOUR_PORT>`.

## Contributing

We welcome contributions to Tour-App! Whether you're fixing bugs, improving the documentation, or proposing new features, your efforts are appreciated.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

If you encounter any issues or have questions about Tour-App, please file an issue on our GitHub repository or contact our support team.

Happy traveling and connecting with new friends around the world!