# chirps

This project is created using Laravel with React.

## Prerequisites
- PHP >= 7.3
- Composer
- Node.js
- npm or yarn

## Installation

1. **Clone the repository:**
    ```sh
    git clone https://github.com/yourusername/chirps.git
    cd chirps
    ```

2. **Install PHP dependencies:**
    ```sh
    composer install
    ```

3. **Install JavaScript dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

4. **Set up environment variables:**
    ```sh
    cp .env.example .env
    php artisan key:generate
    ```

5. **Configure your `.env` file:**
    - Set your database credentials
    - Set other necessary environment variables

6. **Run database migrations:**
    ```sh
    php artisan migrate
    ```

7. **Serve the application:**
    ```sh
    php artisan serve
    ```

8. **Build the front-end assets:**
    ```sh
    npm run dev
    # or
    yarn dev
    ```

9. **Access the application:**
    Open your browser and go to `http://localhost:8000`
