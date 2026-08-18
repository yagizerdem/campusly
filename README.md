## Firebase Auth Rest Api Endpoints

### You can create a new email and password user by issuing an HTTP POST request to the Auth signupNewUser endpoint.

**POST**

`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={{FIREBASE_CLIENT_KEY}}`

**Body**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "returnSecureToken": true
}
```

### You can refresh a Firebase ID token by issuing an HTTP POST request to the securetoken.googleapis.com endpoint.

**POST**

`https://securetoken.googleapis.com/v1/token?key={{FIREBASE_CLIENT_KEY}}`

**Body**

```json
{
  "grant_type": "refresh_token",
  "refresh_token": "{{REFRESH_TOKEN}}"
}
```

### You can exchange a custom Auth token for an ID and refresh token by issuing an HTTP POST request to the Auth verifyCustomToken endpoint.

**POST**
`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={{FIREBASE_CLIENT_KEY}}`

**Body**

```json
{
  "token": "{{CUSTOM_TOKEN}}",
  "returnSecureToken": true
}
```
