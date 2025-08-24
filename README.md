x # Email App

A modern, full-stack email application built with React, TypeScript, Vite, and Tailwind CSS. This project features a client-side interface for composing, sending, and viewing email history, as well as a server-side API for handling email operations.

## Features

- Compose and send emails
- View email history
- Responsive UI with reusable components
- Serverless backend functions (Netlify)
- TypeScript for type safety
- Tailwind CSS for styling

## Project Structure

```
email-App/
├── client/           # Frontend React app
│   ├── components/   # UI components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── pages/        # App pages
│   └── App.tsx       # Main app entry
├── server/           # Server-side API (Node/Express)
│   ├── routes/       # API route handlers
│   └── index.ts      # Server entry point
├── netlify/          # Netlify serverless functions
├── shared/           # Shared code between client and server
├── public/           # Static assets
├── package.json      # Project dependencies
├── tailwind.config.ts# Tailwind CSS config
└── README.md         # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
<p align="center">
  <img src="public/placeholder.svg" alt="Email App Logo" width="200" />
</p>

# Email App

```sh
git clone https://github.com/kiganyamburu/email-App.git
cd email-App
```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the App

#### Development

- Start the Vite dev server:
  ```sh
  npm run dev
  ```
- The app will be available at `http://localhost:5173` by default.

#### Build

- To build the app for production:
  ```sh
  npm run build
  ```

#### Serverless Functions

- Netlify functions are located in `netlify/functions/`.
- To test locally, use Netlify CLI:
  ```sh
  npm install -g netlify-cli
  netlify dev
  ```

## Configuration

- Email configuration details can be found in `EMAIL_CONFIG.md`.
- Update environment variables as needed for your email provider.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
