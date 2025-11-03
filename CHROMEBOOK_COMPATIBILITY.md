# Chromebook Compatibility Guide

This document explains the changes made to improve compatibility with school-issued Chromebooks and web filters.

## Changes Made

### 1. HTML Meta Tags & Security Headers
- Added comprehensive meta tags indicating educational purpose
- Added security headers (CSP, X-Frame-Options, etc.) to help with school filters
- Added PWA manifest for better recognition as a legitimate educational app

### 2. Audio Handling
- Audio is now completely optional and gracefully handles failures
- Audio detection checks if playback is available before attempting
- All audio errors are caught silently to avoid triggering filters
- Audio starts muted by default (good for classroom environments)

### 3. Security Headers
The Express server now includes:
- Content Security Policy (CSP) - allows same-origin resources
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Educational content indicator header
- Permissions policy restricting camera/microphone (not needed for this app)

### 4. Removed Unused Dependencies
These dependencies are in package.json but not used in the codebase:
- `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` - 3D rendering
- `three` - WebGL library
- `vite-plugin-glsl` - Shader support
- `matter-js` - Physics engine
- `gsap` - Animation library
- `howler` - Audio library (using HTMLAudioElement instead)
- `pixi.js`, `ogl`, `meshline` - Graphics libraries

**Note:** These are still in package.json but not imported. You can remove them to reduce bundle size, but leaving them won't cause blocking issues since they're not loaded.

## Hosting Platform Considerations

### Will different hosts affect blocking?

**Short answer:** Potentially, yes. Here's what matters:

#### Factors That Can Cause Blocking:
1. **Domain reputation** - Some hosting platforms have better reputations
2. **HTTPS certificate** - Must be valid and from trusted CA
3. **Content filtering rules** - Some schools block entire domains/CDNs
4. **IP reputation** - Shared hosting can share IPs with blocked sites

#### Platform-Specific Notes:

**Netlify** ⭐ **Recommended**
- ✅ Excellent reputation with schools
- ✅ Automatic HTTPS
- ✅ Good CDN (helps with performance)
- ✅ Free tier available
- ✅ Custom domains allowed
- ✅ Usually not on blacklists

**Railway**
- ✅ Good modern platform
- ⚠️ Less known to schools (could be flagged as "unknown")
- ✅ Custom domains available
- ✅ Good for full-stack apps

**Vercel**
- ✅ Excellent reputation
- ✅ Automatic HTTPS
- ✅ Great CDN
- ✅ Free tier available
- ✅ Often used for educational content

**Replit** (Current)
- ⚠️ Some school districts specifically block Replit
- ✅ GCPS-approved but may still be filtered
- ⚠️ Can be associated with coding/development (sometimes blocked)
- ✅ Good for development

**GitHub Pages**
- ✅ Very high reputation
- ✅ Often allowed by schools
- ⚠️ Static sites only (need separate backend)
- ✅ Free and reliable

**Firebase Hosting**
- ✅ Google-owned (often trusted by schools)
- ✅ Good reputation
- ✅ Automatic HTTPS
- ✅ Free tier available

### Recommendations

1. **For best compatibility:** Try **Netlify** or **Vercel** - these have the best reputations with educational institutions

2. **If still blocked:** 
   - Contact your IT department with:
     - The educational purpose of the app
     - The domain you want whitelisted
     - Evidence it's educational (manifest.json, meta tags help)
   
3. **Alternative approach:**
   - Deploy to a custom domain you control
   - Use a domain that sounds educational (e.g., `biology-learning.com`)
   - This can sometimes help bypass generic filters

4. **Test first:**
   - Before deploying, check if the domain is blocked using a tool like:
     - [Is It Down Right Now?](https://www.isitdownrightnow.com/)
   - Or test from a school device if possible

## Troubleshooting

### If the app is still blocked:

1. **Check browser console** - Look for CSP violations or blocked resources
2. **Test audio separately** - Audio blocking won't prevent the app from working
3. **Verify HTTPS** - Must use HTTPS, not HTTP
4. **Check if it's domain-based blocking** - Try accessing via IP (if possible) to test
5. **Contact IT with specific error** - Some filters give specific error messages

### Common Blocking Reasons:
- ❌ Missing HTTPS certificate
- ❌ Domain on blacklist
- ❌ "Game" keyword in URL/content (some filters block "games")
- ❌ External CDN blocked (e.g., CDNJS, unpkg)
- ❌ WebGL/WebAssembly flagged (not an issue with this app now)
- ❌ Audio autoplay policies

## Testing Checklist

Before deploying to production:
- [ ] Test on a school Chromebook (if possible)
- [ ] Verify HTTPS is working
- [ ] Test audio functionality (should work gracefully if blocked)
- [ ] Check browser console for errors
- [ ] Verify all assets load correctly
- [ ] Test on different browsers (Chrome, Edge, Safari)

## Additional Tips

1. **Add a robots.txt** file to indicate legitimate content
2. **Use a subdomain** like `learning.yourdomain.com` rather than root
3. **Document the educational purpose** clearly in meta tags and headers
4. **Keep bundle size small** - some filters flag large JavaScript bundles
5. **Avoid external fonts/CDNs** if possible (we use @fontsource/inter which bundles locally)

