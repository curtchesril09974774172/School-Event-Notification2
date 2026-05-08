# Deployment Guide

## Local Development

See QUICKSTART.md for local setup.

## Heroku Deployment (Backend)

1. Create Heroku account and install CLI
2. Create new app: `heroku create app-name`
3. Add MongoDB Atlas addon:
   ```bash
   heroku addons:create mongolab:sandbox
   ```
4. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_secret_key
   heroku config:set VAPID_PUBLIC_KEY=your_public_key
   heroku config:set VAPID_PRIVATE_KEY=your_private_key
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

## Netlify Deployment (Frontend)

1. Push frontend folder to GitHub
2. Create new site on Netlify
3. Connect GitHub repository
4. Set build command: None (static site)
5. Set publish directory: `/` (root)
6. Update API URL in `frontend/js/api.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-heroku-app.herokuapp.com/api';
   ```

## Environment Setup for Production

### Backend
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/school-events
JWT_SECRET=use_strong_random_string_here
PORT=5000
VAPID_PUBLIC_KEY=generated_key
VAPID_PRIVATE_KEY=generated_key
```

### Frontend
- Update all API URLs to production backend
- Enable HTTPS
- Update service worker paths

## Database Backup

### MongoDB Atlas
- Automatic backups enabled
- Manual backup via Atlas interface
- Export data: `mongoexport --uri="..." --collection=events --out=backup.json`

## Monitoring

- Check backend logs on Heroku: `heroku logs --tail`
- Monitor API performance
- Track push notification delivery
- Monitor database usage

## HTTPS Setup

Production HTTPS is required for:
- Service Workers
- Push Notifications
- Secure authentication

Most platforms (Heroku, Netlify) provide free SSL certificates.

## Performance Optimization

1. Enable GZIP compression
2. Minify frontend assets
3. Optimize database indexes
4. Use CDN for static files
5. Implement caching strategies

## Security in Production

- Keep dependencies updated: `npm audit fix`
- Use environment variables for secrets
- Enable CORS carefully
- Implement rate limiting
- Use HTTPS everywhere
- Keep MongoDB credentials secure
- Monitor for unusual activity

## Scaling

- Use load balancer for multiple backend instances
- Implement database replication
- Use Redis for caching
- Consider microservices as growth scales

---

For detailed Heroku docs: https://devcenter.heroku.com/
For Netlify docs: https://docs.netlify.com/
