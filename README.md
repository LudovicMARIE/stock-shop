# StockShop

StockShop is a Progressive Web App (PWA) built with Angular 20, featuring inventory management, user authentication, admin controls, and order processing. The app is styled with Tailwind CSS.

## Features

- **User Authentication**: Register and log in as a user or admin.
- **Inventory Management**: View, search, and manage items in stock.
- **Order System**: Place and manage orders for items.
- **Admin Panel**: Manage users, stock, and orders (admin only).
- **PWA Support**: Installable, offline-ready, and updatable via service worker.
- **Responsive UI**: Built with Tailwind CSS for modern, mobile-friendly design.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/LudovicMARIE/stock-shop.git
   cd stock-shop
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

### Development Server

Start the development server:

```sh
ng serve
```

Open [http://localhost:4200/](http://localhost:4200/) in your browser. The app reloads automatically on code changes.

### Building for Production

To build the project for production:

```sh
ng build --configuration=production
```

The output will be in the `dist/` directory, optimized for deployment.

### Running Unit Tests

To execute unit tests with [Karma](https://karma-runner.github.io):

```sh
ng test
```

### Linting and Formatting

- **Lint code:**  
  ```sh
  ng lint
  ```
- **Auto-fix lint issues:**  
  ```sh
  ng lint --fix
  ```
- **Format code:**  
  ```sh
  npm run format
  ```

## Project Structure

- `src/app/features/auth`: Authentication (login, register, guards, services)
- `src/app/features/items`: Item models, services, and components
- `src/app/features/order`: Order models, services, and components
- `src/app/features/admin`: Admin dashboard and management
- `src/app/shared`: Shared components, pipes, and services (PWA, error handling, forms)
- `src/app/core`: Core interceptors and guards
- `public/`: Static assets and PWA manifest

## PWA Features

- **Installable**: Add to home screen on supported devices.
- **Update Notifications**: Prompts user when a new version is available.

## Customization

- **Tailwind CSS**: Customize styles in [`tailwind.config.js`](tailwind.config.js) and [`src/styles.scss`](src/styles.scss).
- **Environment**: Adjust Angular and PWA settings in [`angular.json`](angular.json) and [`ngsw-config.json`](ngsw-config.json).

## License

This project is licensed under the [MIT License](LICENSE).

---

> Generated with Angular CLI and enhanced for modern web app development.