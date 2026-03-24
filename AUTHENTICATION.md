# Authentication System

This application implements a complete authentication system with route protection.

## Overview

The authentication system consists of three main components:

1. **Authentication API Functions** (`lib/auth.ts`)
2. **Route Protection Middleware** (`middleware.ts`)
3. **Login/Register Pages** (`app/(auth)/login` and `app/(auth)/register`)

## How It Works

### 1. User Authentication Flow

When a user logs in or registers:

1. The user submits their credentials through the login/register form
2. The frontend calls the backend API endpoint (`/user/login` or `/user/signup`)
3. If successful, the backend returns a JWT token
4. The token is stored in two places:
   - **localStorage**: For client-side API calls
   - **HTTP Cookie**: For server-side middleware authentication checks

### 2. Route Protection

The `middleware.ts` file runs **before every route** in the application. It exports a function named `middleware()` that handles all route protection logic:

- **Public Routes** (accessible to everyone):
  - `/` - Homepage
  - `/login` - Login page
  - `/register` - Registration page

- **Protected Routes** (requires authentication):
  - All other routes (`/dashboard`, `/quiz`, `/study`, `/live`, etc.)

When a user tries to access a protected route:

1. Proxy middleware checks for the `auth_token` cookie
2. If the token exists → User can proceed to the requested page
3. If the token doesn't exist → User is redirected to `/login?redirect=/original-path`
4. After successful login, the user is redirected back to their original destination

### 3. Token Storage

Tokens are stored in both cookies and localStorage:

- **Cookies**: Used by Next.js middleware for server-side route protection
- **localStorage**: Used by client-side code for API calls

Both storage mechanisms are synchronized and cleared together when the user logs out.

## Security Features

- **SameSite=Strict**: Prevents CSRF attacks
- **Secure flag** (production only): Ensures cookies are only sent over HTTPS
- **7-day expiration**: Tokens automatically expire after 7 days
- **Path=/**: Cookie is accessible across the entire application

## Usage Examples

### Check if user is authenticated (client-side)

```typescript
import { isAuthenticated } from "@/lib/auth";

if (isAuthenticated()) {
  // User is logged in
} else {
  // User is not logged in
}
```

### Get the authentication token

```typescript
import { getToken } from "@/lib/auth";

const token = getToken();
// Use token for API calls
```

### Logout a user

```typescript
import { logout } from "@/lib/auth";

await logout();
// User is logged out, token is cleared, API logout endpoint is called
```

## Development vs Production

The authentication system behaves slightly differently in development and production:

- **Development** (localhost): Cookies do not have the `Secure` flag (works without HTTPS)
- **Production**: Cookies have the `Secure` flag (requires HTTPS)

## Customization

### Adding More Public Routes

Edit `middleware.ts` and add routes to the `publicRoutes` array:

```typescript
const publicRoutes = ["/", "/login", "/register", "/about", "/contact"];
```

### Changing Token Expiration

Edit `lib/auth.ts` in the `storeToken` function:

```typescript
const expiryDays = 7; // Change this to your desired expiration
```

### Customizing Redirect Behavior

The middleware automatically adds a `redirect` query parameter when redirecting to login.
After successful login, users are sent back to their original destination.

To disable this behavior, modify the login page to ignore the redirect parameter:

```typescript
// Instead of:
const redirectTo = searchParams.get("redirect") || "/dashboard";

// Use:
const redirectTo = "/dashboard";
```
