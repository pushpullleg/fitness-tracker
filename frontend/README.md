# Fittober Fitness Tracker - Frontend Dashboard

A beautiful, responsive web dashboard that displays team fitness activity data in real-time using Chart.js visualizations.

## 🎨 Features

- **Real-time Updates**: Automatically refreshes data every 60 seconds
- **Interactive Pie Chart**: Shows total minutes per team member with tooltips
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradient design with smooth animations
- **Error Handling**: Graceful error states with retry functionality
- **Loading States**: Visual feedback during data fetching

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

1. **Create a new GitHub repository**
2. **Upload the `index.html` file**
3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
4. **Update the backend URL** in `index.html`:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.herokuapp.com';
   ```
5. **Access your dashboard** at `https://yourusername.github.io/your-repo-name`

### Option 2: Local Development

1. **Open `index.html` in a web browser**
2. **Update the backend URL** if running locally:
   ```javascript
   const API_BASE_URL = 'http://localhost:3000';
   ```
3. **Ensure your backend is running** (see backend README)

### Option 3: Netlify (Alternative)

1. **Drag and drop** the `index.html` file to [Netlify Drop](https://app.netlify.com/drop)
2. **Update the backend URL** in the deployed site
3. **Your dashboard is live** at the provided Netlify URL

## 🎯 Configuration

### Backend URL Setup

Update the `API_BASE_URL` in `index.html` based on your deployment:

```javascript
const API_BASE_URL = window.location.origin.includes('github.io') 
    ? 'https://your-backend-url.herokuapp.com'  // Production backend
    : 'http://localhost:3000';                   // Local development
```

**Replace `your-backend-url.herokuapp.com` with your actual backend URL.**

### Customization Options

#### Colors
Modify the color palette in the `colors` array:

```javascript
const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
];
```

#### Refresh Interval
Change the auto-refresh frequency (default: 60 seconds):

```javascript
setInterval(loadData, 60000); // 60 seconds = 60000ms
```

#### Chart Type
Switch from pie chart to other Chart.js types:

```javascript
type: 'doughnut',  // or 'bar', 'line', etc.
```

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:

- **Desktop**: Full-featured experience with large charts
- **Tablet**: Adapted layout with touch-friendly controls  
- **Mobile**: Compact design with stacked elements

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🎨 UI Components

### Header
- **Title**: "🏃‍♂️ Fittober" with gradient text shadow
- **Subtitle**: "Team Fitness Activity Tracker"

### Statistics Cards
- **Total Team Minutes**: Shows cumulative team activity
- **Active Members**: Displays number of participating members

### Chart Section
- **Interactive Pie Chart**: Hover for member details and percentages
- **Legend**: Color-coded member names
- **Tooltips**: Show member name, minutes, and percentage

### Status Indicators
- **Loading State**: Shows while fetching data
- **Error State**: Displays error message with retry button
- **Refresh Indicator**: Brief notification when data updates
- **Last Updated**: Timestamp of most recent data fetch

## 🔧 Technical Details

### Dependencies
- **Chart.js**: For data visualization (loaded via CDN)
- **No build process required**: Pure HTML/CSS/JavaScript

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- **Lightweight**: Single HTML file under 50KB
- **Fast Loading**: CDN resources with fallbacks
- **Efficient Updates**: Only re-renders chart when data changes

## 🐛 Troubleshooting

### Common Issues

1. **Chart Not Displaying**
   - Check browser console for JavaScript errors
   - Verify Chart.js CDN is loading
   - Ensure backend URL is correct

2. **No Data Showing**
   - Verify backend is running and accessible
   - Check CORS settings on backend
   - Test `/aggregates.json` endpoint directly

3. **Mobile Layout Issues**
   - Clear browser cache
   - Check viewport meta tag
   - Test on different devices

4. **Auto-refresh Not Working**
   - Check browser console for errors
   - Verify JavaScript is enabled
   - Test manual refresh button

### Debug Mode

Open browser developer tools (F12) to see:
- Network requests to backend
- Console errors or warnings
- Chart.js rendering logs

## 🎨 Customization Guide

### Styling
All styles are contained within the `<style>` tag. Key customization areas:

```css
/* Change main gradient */
body {
    background: linear-gradient(135deg, #your-color-1, #your-color-2);
}

/* Modify card colors */
.stat-card {
    background: linear-gradient(135deg, #your-gradient-1, #your-gradient-2);
}

/* Adjust chart container height */
.chart-container {
    height: 500px; /* Increase for larger chart */
}
```

### Adding New Features

#### Additional Statistics
Add new stat cards to the grid:

```html
<div class="stat-card">
    <h3>Your New Stat</h3>
    <div class="number" id="your-stat">0</div>
    <div class="label">your label</div>
</div>
```

#### Multiple Charts
Add new chart containers:

```html
<div class="chart-container">
    <canvas id="yourNewChart"></canvas>
</div>
```

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update `API_BASE_URL` to production backend
- [ ] Test with production data
- [ ] Verify HTTPS is working
- [ ] Check mobile responsiveness
- [ ] Test error handling
- [ ] Validate accessibility

## 📊 Analytics Integration

To add Google Analytics or other tracking:

```html
<!-- Add before closing </head> tag -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🔒 Security Considerations

- **CORS**: Backend must allow frontend domain
- **HTTPS**: Use HTTPS in production
- **No Sensitive Data**: Frontend only displays aggregated data
- **Input Validation**: Backend handles all data validation

## 📞 Support

For issues with the frontend:

1. **Check browser console** for JavaScript errors
2. **Verify backend connectivity** by testing the API endpoint
3. **Test in different browsers** to isolate browser-specific issues
4. **Check network connectivity** and firewall settings

---

**Built with ❤️ for the Fittober team**

*Beautiful, responsive, and real-time fitness tracking dashboard*
