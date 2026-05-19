# 🚀 Deployment Checklist

Before deploying to production, complete all items in this checklist.

---

## 🔐 Security

### Critical
- [ ] Change `SECRET_KEY` in `backend/auth.py` to a random 32+ character string
  ```python
  SECRET_KEY = "your-new-random-key-at-least-32-characters"
  ```

- [ ] Set environment variables instead of hardcoding:
  ```bash
  export SECRET_KEY="your-secret-key"
  export DATABASE_URL="postgresql://..."
  export CORS_ORIGINS="https://yourdomain.com"
  ```

- [ ] Enable HTTPS (SSL/TLS certificate)

- [ ] Update CORS origins from `*` to specific domain:
  ```python
  CORS_ORIGINS = ["https://yourdomain.com"]
  ```

- [ ] Set cookies to Secure and HttpOnly:
  ```python
  # Add to main.py CORS config
  allow_credentials=True,
  allow_origin_regex="https://.*"
  ```

- [ ] Remove `.env` files from git history
  ```bash
  git filter-branch --tree-filter 'rm -f .env' -- --all
  ```

### Important
- [ ] Add rate limiting to `/api/auth/login` endpoint
- [ ] Implement CSRF protection if using cookies
- [ ] Add request validation limits (max JSON size)
- [ ] Set up API request logging/monitoring
- [ ] Use parameterized queries (already using SQLAlchemy ORM ✓)

---

## 💾 Database

### Before Deploying
- [ ] Migrate from SQLite to PostgreSQL (or production DB)
  
  **Update** `backend/database.py`:
  ```python
  DATABASE_URL = os.getenv(
      "DATABASE_URL",
      "postgresql://user:password@localhost/support_crm"
  )
  ```

- [ ] Create database migrations (use Alembic)
  ```bash
  pip install alembic
  alembic init migrations
  alembic revision --autogenerate -m "initial schema"
  ```

- [ ] Set up automated backups
  ```bash
  # PostgreSQL backup example
  pg_dump -h localhost -U user support_crm > backup.sql
  ```

- [ ] Test database connection from production environment
- [ ] Set up read replicas if needed
- [ ] Enable row-level security if multi-tenant

---

## 🔑 Authentication

### Token Management
- [ ] Implement refresh tokens for better security
  ```python
  # Add to auth.py
  def create_refresh_token(user_id: int):
      exp = datetime.utcnow() + timedelta(days=7)
      payload = {"sub": user_id, "type": "refresh", "exp": exp}
      return jose.jwt.encode(payload, SECRET_KEY, ALGORITHM)
  ```

- [ ] Add token blacklist/logout functionality
  ```python
  # Store invalidated tokens in Redis
  REVOKED_TOKENS = set()
  ```

- [ ] Implement password reset functionality
- [ ] Add email verification for new accounts
- [ ] Set stronger password requirements (min 8 chars, special chars)

### User Management
- [ ] Implement admin user creation interface
  ```python
  # Add to main.py
  POST /api/admin/users          # Create admin users
  DELETE /api/admin/users/{id}   # Delete users
  PUT /api/admin/users/{id}      # Update user roles
  ```

- [ ] Add user lockout after failed login attempts
  ```python
  # Add failed_login_count to User model
  # Lock after 5 failed attempts
  ```

---

## 📝 Logging & Monitoring

### Setup Logging
- [ ] Configure structured logging (use `python-json-logger`)
  ```python
  import json
  logger.info(json.dumps({"event": "login", "user_id": user_id}))
  ```

- [ ] Log all authentication events
  - User registration
  - User login
  - Failed login attempts
  - Token refresh
  - Logout

- [ ] Log all admin actions
  - Ticket updates
  - Ticket deletions
  - User role changes

### Monitoring
- [ ] Set up error tracking (Sentry)
  ```bash
  pip install sentry-sdk
  ```

- [ ] Set up performance monitoring (New Relic / DataDog)
- [ ] Monitor database query performance
- [ ] Set up uptime monitoring
- [ ] Create alerts for:
  - Multiple failed login attempts
  - Database errors
  - API response time > 1s
  - Memory usage > 80%

---

## 🌍 Frontend Deployment

### Build Optimization
- [ ] Run production build
  ```bash
  npm run build
  ```

- [ ] Test production build locally
  ```bash
  npm run preview
  ```

- [ ] Verify no console errors/warnings
- [ ] Check bundle size
  ```bash
  npm run build -- --analyze
  ```

### Environment
- [ ] Update `frontend/.env.production` with API URL
  ```
  VITE_API_BASE_URL=https://api.yourdomain.com
  ```

- [ ] Verify CORS headers are correct
- [ ] Test API calls from production domain

### CDN & Caching
- [ ] Use CDN for static assets
- [ ] Set cache headers for static files (1 year)
- [ ] Set cache headers for index.html (no-cache)
- [ ] Enable gzip compression

---

## 📦 Backend Deployment

### Prepare Production Server
- [ ] Install Python 3.8+
- [ ] Create virtual environment
  ```bash
  python -m venv venv
  source venv/bin/activate  # Linux/Mac
  # or
  venv\Scripts\activate  # Windows
  ```

- [ ] Install production dependencies
  ```bash
  pip install -r requirements.txt
  ```

- [ ] Add production-only dependencies
  ```bash
  pip install gunicorn psycopg2-binary redis
  pip freeze > requirements-prod.txt
  ```

### Run Production Server
- [ ] Use Gunicorn instead of Uvicorn
  ```bash
  gunicorn -w 4 -b 0.0.0.0:8000 main:app
  # Or with Uvicorn for async support
  gunicorn -w 1 -k uvicorn.workers.UvicornWorker main:app
  ```

- [ ] Use process manager (systemd, supervisor, PM2)
- [ ] Set up load balancing if needed
- [ ] Configure reverse proxy (Nginx)
  ```nginx
  upstream app {
      server 127.0.0.1:8000;
  }
  
  server {
      listen 80;
      server_name api.yourdomain.com;
      
      location / {
          proxy_pass http://app;
          proxy_set_header Authorization $http_authorization;
      }
  }
  ```

---

## 📋 Configuration Management

### Environment Variables
All sensitive config should be in `.env`:
```
DATABASE_URL=postgresql://...
SECRET_KEY=your-32-char-secret
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False
CORS_ORIGINS=https://yourdomain.com
LOG_LEVEL=INFO
SENTRY_DSN=https://...
```

- [ ] Don't commit `.env` to git
- [ ] Use `.env.example` as template
- [ ] Document all required variables
- [ ] Set different values for dev/staging/prod

---

## ✅ Testing

### Pre-Deployment Testing
- [ ] Run all unit tests
  ```bash
  pytest backend/
  ```

- [ ] Test authentication flow
  - [ ] Register new user
  - [ ] Login with correct password
  - [ ] Login with wrong password (should fail)
  - [ ] Access protected endpoint without token
  - [ ] Access protected endpoint with expired token

- [ ] Test role-based access
  - [ ] Customer can't access admin endpoints
  - [ ] Admin can access all endpoints
  - [ ] Customer can only see own tickets

- [ ] Test error handling
  - [ ] Invalid input validation
  - [ ] Database connection failure
  - [ ] Token validation errors

### Load Testing
- [ ] Test concurrent users (100+)
  ```bash
  pip install locust
  locust -f locustfile.py
  ```

- [ ] Test API response times under load
- [ ] Test database connection pooling

---

## 🔄 Continuous Deployment

### Set Up CI/CD
- [ ] GitHub Actions workflow
  ```yaml
  name: Deploy
  on: [push]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        - name: Install dependencies
          run: pip install -r requirements.txt
        - name: Run tests
          run: pytest
        - name: Deploy
          run: ./deploy.sh
  ```

- [ ] Automated testing on each push
- [ ] Automated build & deployment
- [ ] Rollback mechanism for failed deployments

---

## 📚 Documentation

- [ ] Write deployment guide
- [ ] Document system architecture
- [ ] Document API endpoints
- [ ] Write troubleshooting guide
- [ ] Create runbook for common issues
- [ ] Document backup/restore procedures

---

## 🎯 Go-Live Checklist

### Final Verification
- [ ] All security items checked ✓
- [ ] All tests passing ✓
- [ ] Database migrated ✓
- [ ] Environment variables set ✓
- [ ] Logging configured ✓
- [ ] Monitoring configured ✓
- [ ] Backups tested ✓
- [ ] SSL certificate installed ✓
- [ ] Load tested ✓
- [ ] Team trained on deployment ✓

### Deployment
- [ ] Deploy backend to production
- [ ] Deploy frontend to production
- [ ] Verify API endpoints working
- [ ] Verify authentication flow working
- [ ] Monitor logs for errors
- [ ] Performance metrics normal
- [ ] No spike in error rates

### Post-Deployment
- [ ] Monitor for issues
- [ ] Send announcement to users
- [ ] Gather user feedback
- [ ] Document any issues found
- [ ] Plan follow-up improvements

---

## 🚨 Emergency Procedures

### If Issues Occur
1. [ ] Check logs immediately
2. [ ] Identify root cause
3. [ ] Decide: Fix or Rollback?
4. [ ] If rolling back:
   ```bash
   git revert <commit-hash>
   ./deploy.sh
   ```
5. [ ] Notify users
6. [ ] Post-mortem meeting

### Common Issues

**"Token validation failed"**
- Check SECRET_KEY matches on frontend and backend
- Check token expiration time
- Clear browser cache/localStorage

**"CORS error"**
- Update CORS_ORIGINS in environment
- Verify frontend domain matches

**"Database connection error"**
- Check DATABASE_URL environment variable
- Verify database is running
- Check database credentials

**"API returning 500 errors"**
- Check server logs
- Verify environment variables set
- Test database connection
- Restart application server

---

## 📞 Support Contacts

Document who to contact for:
- [ ] Database issues: _________
- [ ] Server/infrastructure: _________
- [ ] Application errors: _________
- [ ] Security issues: _________
- [ ] On-call engineer: _________

---

## ✨ After Launch

### Improvements to Plan
- [ ] Enable refresh tokens
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add two-factor authentication
- [ ] Set up advanced analytics
- [ ] Implement audit logging
- [ ] Add ticket comments
- [ ] Support file attachments
- [ ] Mobile app version
- [ ] API rate limiting

---

## Notes

Record any production-specific configs or issues:

```

[Your notes here]

```

---

**Last Updated:** ___________
**Deployed By:** ___________
**Deployment Date:** ___________
**Status:** [ ] Not Started  [ ] In Progress  [ ] Complete

