# 🚀 Droplink.space Deployment Guide

This guide will help you deploy your Droplink application to `droplink.space` with dynamic profile routing.

## 📋 Prerequisites

- Domain: `droplink.space` (or your preferred domain)
- Vercel account (recommended) or other hosting platform
- Supabase project with database
- GitHub repository

## 🗄️ Database Setup

### 1. Run Database Migration

Execute the migration file to create the required tables:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in your Supabase dashboard
# File: supabase/migrations/20241220000000_create_profile_tables.sql
```

### 2. Verify Tables Created

Ensure these tables exist in your Supabase database:
- `profiles` - User profile data
- `links` - User links
- `profile_views` - Analytics tracking
- `link_clicks` - Link click tracking

## 🌐 Domain Configuration

### 1. Vercel Deployment

1. **Connect Repository to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy to Vercel
   vercel --prod
   ```

2. **Add Custom Domain:**
   - Go to Vercel Dashboard → Project Settings → Domains
   - Add `droplink.space` as custom domain
   - Configure DNS records as instructed by Vercel

### 2. DNS Configuration

Configure these DNS records with your domain registrar:

```
Type: A
Name: @
Value: 76.76.19.19 (Vercel's IP)

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### 3. SSL Certificate

Vercel automatically provides SSL certificates for custom domains.

## 🔧 Environment Variables

Set these environment variables in Vercel:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Domain Configuration
VITE_DOMAIN=droplink.space
VITE_PROTOCOL=https

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

## 📱 Dynamic Routing Structure

Your app now supports these URL patterns:

```
droplink.space/                    → Home page
droplink.space/dashboard           → User dashboard
droplink.space/username            → Public profile (NEW!)
droplink.space/link/username       → Linktree style profile
droplink.space/pi/username         → Pi Network style profile
droplink.space/live/username       → Live preview profile
```

## 🎨 Template System

Users can now choose from:

### Ready-Made Templates:
- **Modern Dark** - Sleek dark theme with purple accents
- **Minimal Light** - Clean and minimal white theme
- **Vibrant Gradient** - Bold gradients with vibrant colors
- **Professional Blue** - Corporate blue theme
- **Sunset Warm** - Warm orange and pink theme
- **Ocean Cool** - Cool blue ocean theme

### Custom Templates:
- Full color customization
- Typography options
- Layout controls
- Save and reuse templates

## 🔍 SEO Features

Each profile page includes:

- **Dynamic Meta Tags** - Title, description, Open Graph
- **Twitter Cards** - Rich social media previews
- **Structured Data** - JSON-LD for search engines
- **Canonical URLs** - Proper URL structure
- **Social Media Integration** - Share buttons and tracking

## 📊 Analytics

Built-in analytics tracking:

- **Profile Views** - Track who visits profiles
- **Link Clicks** - Monitor link performance
- **User Agents** - Browser and device analytics
- **Referrer Tracking** - Traffic source analysis

## 🚀 Deployment Steps

### 1. Build and Test Locally

```bash
# Install dependencies
npm install

# Run database migration
supabase db push

# Start development server
npm run dev

# Test profile URLs
# http://localhost:2222/username
```

### 2. Deploy to Vercel

```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Or connect GitHub repo to Vercel for automatic deployments
```

### 3. Configure Domain

1. Add `droplink.space` in Vercel dashboard
2. Update DNS records at your registrar
3. Wait for SSL certificate (usually 24-48 hours)

### 4. Test Production

```bash
# Test these URLs after deployment:
https://droplink.space/
https://droplink.space/dashboard
https://droplink.space/your-username
```

## 🔒 Security Features

- **Row Level Security (RLS)** - Database access control
- **CORS Configuration** - Cross-origin request handling
- **Content Security Policy** - XSS protection
- **Rate Limiting** - API abuse prevention

## 📈 Performance Optimizations

- **Static Generation** - Pre-built pages for better performance
- **Image Optimization** - Automatic image compression
- **CDN Distribution** - Global content delivery
- **Caching Headers** - Browser caching optimization

## 🛠️ Maintenance

### Database Maintenance

```sql
-- Clean up old analytics data (run monthly)
DELETE FROM profile_views WHERE viewed_at < NOW() - INTERVAL '1 year';
DELETE FROM link_clicks WHERE clicked_at < NOW() - INTERVAL '1 year';

-- Update statistics
SELECT get_profile_stats('profile-uuid-here');
```

### Monitoring

- **Vercel Analytics** - Performance monitoring
- **Supabase Dashboard** - Database monitoring
- **Error Tracking** - Built-in error boundaries

## 🎯 Next Steps

1. **Custom Domain Setup** - Configure your domain DNS
2. **SSL Certificate** - Wait for automatic SSL setup
3. **Test Profiles** - Create test profiles to verify functionality
4. **Analytics Setup** - Configure Google Analytics if needed
5. **Social Media** - Set up social media previews

## 🆘 Troubleshooting

### Common Issues:

1. **404 on Profile Pages**
   - Check Vercel rewrites configuration
   - Verify React Router setup

2. **Database Connection Issues**
   - Verify Supabase environment variables
   - Check RLS policies

3. **Domain Not Working**
   - Wait for DNS propagation (up to 48 hours)
   - Check DNS records configuration

4. **SSL Certificate Issues**
   - Wait for automatic SSL setup
   - Check domain verification in Vercel

## 📞 Support

For issues or questions:
- Check Vercel documentation
- Review Supabase documentation
- Check GitHub issues in your repository

---

## ✅ Deployment Checklist

- [ ] Database migration executed
- [ ] Environment variables configured
- [ ] Vercel deployment successful
- [ ] Custom domain added
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Profile URLs working
- [ ] Analytics tracking functional
- [ ] SEO meta tags working
- [ ] Template system functional

**🎉 Congratulations! Your Droplink.space is now live!**

Users can now create profiles and get URLs like:
- `droplink.space/username`
- `droplink.space/influencer`
- `droplink.space/creator`

Each profile will have beautiful templates, analytics, and SEO optimization!
