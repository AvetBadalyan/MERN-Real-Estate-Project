# Avet's Estate

Avet's Estate is a MERN real estate portfolio app where users can browse, search, create, update, and delete property listings. It uses MongoDB for app data, Express/Node for the API, React/Vite for the frontend, Redux for user state, Firebase Auth for Google sign-in, and backend-served local images.

## What This App Does

- Shows recent offers, rentals, and sale listings on the home page.
- Lets users search listings by keyword, type, amenities, offer status, and sort order.
- Shows listing detail pages with image galleries and seller contact flow.
- Supports email/password auth and Google auth.
- Protects profile, create-listing, and update-listing pages.
- Lets authenticated users create/update/delete their own listings.
- Uploads listing images and profile avatars through the backend.
- Serves existing local images from the root `images/` folder.

## Project Structure

```text
.
├── backend/
│   ├── controllers/      # Express route handlers
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── utils/            # error handler and JWT verification
│   └── index.js          # Express app, MongoDB connection, upload route
├── client/
│   ├── src/
│   │   ├── components/   # shared React components
│   │   ├── pages/        # route pages
│   │   ├── redux/        # Redux store and user slice
│   │   ├── utils/        # image URL helpers
│   │   └── firebase.js   # Firebase app config for Google auth
│   └── vite.config.js    # Vite dev server config and proxies
├── images/               # locally served listing/profile images
├── .env.example          # backend env variable template
├── client/.env.example   # frontend env variable template
└── package.json          # root/backend scripts and dependencies
```

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JSON Web Tokens
- bcryptjs
- multer for image uploads

### Frontend

- React
- Vite
- React Router
- Redux Toolkit
- Redux Persist
- Tailwind CSS
- React Toastify
- Swiper
- Firebase Auth for Google sign-in

## Environment Variables

This repo uses two env files locally.

### Root `.env`

Create this in the project root:

```env
MONGO=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
PORT=3000
```

Use `.env.example` as the template.

### Client `client/.env`

Create this inside `client/`:

```env
VITE_FIREBASE_API_KEY=<your-firebase-web-api-key>
```

Use `client/.env.example` as the template.

Do not commit real `.env` files. They are ignored by Git.

## How To Run Locally

Install dependencies from the project root:

```bash
npm install
npm install --prefix client
```

Start the backend in one terminal:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:3000
```

Start the frontend in another terminal:

```bash
npm run dev --prefix client
```

The frontend runs at:

```text
http://localhost:5173
```

The Vite dev server proxies these paths to the backend:

- `/api` -> `http://localhost:3000/api`
- `/images` -> `http://localhost:3000/images`

That means frontend code can call `/api/listing` and use `/images/example.jpg` without hardcoding the backend URL.

## Production Build

Build the frontend:

```bash
npm run build --prefix client
```

Run the production-style server locally:

```bash
npm start
```

Then open:

```text
http://localhost:3000
```

In production, Express serves `client/dist` and also serves images from `images/`.

## Image Storage

This project used Firebase Storage before. Firebase Storage has now been removed from the app.

Current behavior:

- Existing images live in the root `images/` folder.
- Express serves that folder at `/images`.
- New uploads go to `POST /api/upload`.
- The backend saves uploaded files into `images/` with a timestamped filename.
- MongoDB stores only the image path, for example `/images/1718451522409_house.jpg`.
- Old Firebase Storage URLs in MongoDB are mapped on the frontend to local `/images/<filename>` paths by `client/src/utils/images.js`.

Important deployment note:

- Images committed in the `images/` folder will deploy with the app.
- Images uploaded after deployment are saved on the server filesystem.
- On hosts like Render, runtime-uploaded files may disappear after redeploy/restart unless a persistent disk or external image storage provider is used.
- For a portfolio app with committed demo images, this is usually fine.
- For permanent production uploads, use Cloudinary, S3, Render Persistent Disk, or another durable storage provider.

## Backend API Routes

### Auth

```text
POST /api/auth/signup       create an email/password user
POST /api/auth/signin       sign in with email/password
POST /api/auth/google       sign in or create user with Google auth data
GET  /api/auth/signout      clear auth cookie
```

### Users

```text
GET    /api/user/listings/:id
GET    /api/user/:id
PUT    /api/user/:id
DELETE /api/user/:id
```

Most user routes require a valid auth cookie.

### Listings

```text
GET    /api/listing
GET    /api/listing/:id
POST   /api/listing
PUT    /api/listing/:id
DELETE /api/listing/:id
```

Create, update, and delete require authentication.

Listing query examples:

```text
/api/listing?limit=4
/api/listing?type=rent&limit=4
/api/listing?type=sale&offer=true
/api/listing?searchTerm=apartment&parking=true&sort=regularPrice&order=asc
```

### Uploads

```text
POST /api/upload
```

This route requires authentication and expects multipart form data with one field named `image`.

Upload limits:

- image files only
- maximum file size: 5 MB

Response example:

```json
{
  "imageUrl": "/images/1718451522409_house.jpg"
}
```

## Frontend Routes

```text
/                         home
/sign-in                  sign in
/sign-up                  sign up
/search                   search listings
/listing/:listingId       listing details
/profile                  user profile, private
/create-listing           create listing, private
/update-listing/:id       update listing, private
```

Private routes are guarded by `PrivateRoute`, which checks the Redux user state.

## Common Development Commands

```bash
# install root/backend dependencies
npm install

# install client dependencies
npm install --prefix client

# run backend dev server
npm run dev

# run frontend dev server
npm run dev --prefix client

# lint frontend
npm run lint --prefix client

# build frontend
npm run build --prefix client

# run production server locally after build
npm start
```

## Troubleshooting

### `Failed to fetch listings` on localhost

Check that the backend is running on port `3000`:

```bash
curl -i "http://localhost:3000/api/listing?limit=1"
```

If it returns `Cannot GET /api/listing`, another app may be using port `3000`.

On Windows, find the process:

```bash
netstat -ano | findstr :3000
```

Then close that app or stop the PID, and restart this backend:

```bash
npm run dev
```

### Images are broken locally

Check the backend image URL:

```bash
curl -I "http://localhost:3000/images/<filename>"
```

Check the Vite-proxied image URL:

```bash
curl -I "http://localhost:5173/images/<filename>"
```

Both should return an image content type such as `image/jpeg`, `image/png`, or `image/webp`.

### Env variables are missing

Copy the examples:

```bash
cp .env.example .env
cp client/.env.example client/.env
```

Then fill in real values from MongoDB Atlas, Render, and Firebase Console.

### Google sign-in does not work locally

Check:

- `client/.env` contains `VITE_FIREBASE_API_KEY`
- Firebase Auth has Google provider enabled
- Firebase authorized domains include the local/deployed domain you are testing

## Deployment Notes

For Render-style deployment:

1. Commit code changes and the demo files in `images/`.
2. Do not commit real `.env` files.
3. Add env variables in the Render dashboard:
   - `MONGO`
   - `JWT_SECRET`
4. Add frontend env variable if Render builds the client:
   - `VITE_FIREBASE_API_KEY`
5. Use the root build command:

```bash
npm run build
```

6. Use the start command:

```bash
npm start
```

## Notes For Future Maintenance

- Firebase is currently used only for Google authentication, not Storage.
- MongoDB stores users, listings, and image URL/path strings. It does not store image files.
- The `images/` folder is important because existing demo listings depend on it.
- Listing and user routes use REST-style resource URLs.
- Before major refactors, run:

```bash
npm run lint --prefix client
npm run build --prefix client
```

## License

ISC
