# Bus Park and Route Information Website

A responsive web application that provides comprehensive information about bus parks, available transport routes, estimated fare ranges, and contact details of transport unions. The system allows users to search for bus parks or routes and view bus park locations on an interactive map.

## Features

### 1. Bus Park Listing
- Display bus parks grouped by city and state
- Each bus park includes:
  - Park name
  - City and State
  - Contact phone number
  - Transport union name
  - Location coordinates

### 2. Bus Route Information
- Display routes available from each bus park
- Each route shows:
  - Departure bus park
  - Destination
  - Estimated fare range
  - Route name

### 3. Search Functionality
- Search bus parks by park name, city, or state
- Search routes by destination or route name
- Global search bar available on all pages

### 4. Map Integration
- Display bus park locations on an interactive map using Leaflet.js
- Each bus park has a map marker
- Clicking a marker shows park details

### 5. Transport Union Contacts
- Display transport union contact information associated with each bus park

## Application Pages

### 1. Home Page (`index.html`)
- Overview of the application
- Global search bar for parks and routes
- Featured bus parks section
- Popular routes section
- About section

### 2. Parks Page (`parks.html`)
- List of all bus parks in card format
- Filter by city or state
- Clickable parks to view details
- Search functionality

### 3. Routes Page (`routes.html`)
- List of available routes in a responsive grid layout
- Display destinations and estimated fares with styled cards
- Each route card shows:
  - Destination with location icon
  - Fare range in a prominent badge
  - Departure park information
  - Route name
- Filter by departure park
- Search functionality
- Hover effects and smooth transitions
- Fully responsive design for all screen sizes

### 4. Details Page (`details.html`)
- Full details of a selected bus park or route
- Contact information
- Interactive map showing location
- Related routes (for parks) or park details (for routes)

## Technologies Used

- **Frontend:**
  - HTML5
  - CSS3 (with CSS Variables and Flexbox/Grid)
  - Vanilla JavaScript (ES6+)
  
- **Libraries:**
  - Leaflet.js (for interactive maps)
  - OpenStreetMap (map tiles)

- **Data Storage:**
  - JSON file (`data/bus-data.json`)

## Project Structure

```
Bus/
├── index.html          # Home page
├── parks.html          # Parks listing page
├── routes.html         # Routes listing page
├── details.html        # Details page
├── README.md           # Project documentation
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── app.js          # Main JavaScript file
└── data/
    └── bus-data.json   # Bus parks, routes, and unions data
```

## Installation and Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, but recommended)

### Option 1: Using a Local Web Server (Recommended)

#### Using Python (if installed):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Using Node.js (if installed):
```bash
# Install http-server globally
npm install -g http-server

# Run the server
http-server -p 8000
```

#### Using PHP (if installed):
```bash
php -S localhost:8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

### Option 2: Direct File Opening
You can open `index.html` directly in your browser, but note that:
- Some features may not work due to CORS restrictions when loading JSON files
- It's recommended to use a local web server

## Usage

1. **Home Page:**
   - Use the search bar to search for parks or routes
   - Browse featured parks and routes
   - Click on any card to view details

2. **Parks Page:**
   - View all available bus parks
   - Use filters to narrow down by city or state
   - Use search to find specific parks
   - Click on any park card to view full details

3. **Routes Page:**
   - View all available routes
   - Filter routes by departure park
   - Use search to find specific routes
   - Click on any route to view full details

4. **Details Page:**
   - View complete information about a park or route
   - See location on an interactive map
   - View related routes (for parks) or park information (for routes)
   - Navigate back using the back button

## Data Structure

The application uses a JSON file (`data/bus-data.json`) with the following structure:

```json
{
  "busParks": [
    {
      "id": "park-001",
      "name": "Park Name",
      "city": "City",
      "state": "State",
      "contactPhone": "+234-xxx-xxx-xxxx",
      "transportUnion": "Union Name",
      "latitude": 0.0,
      "longitude": 0.0,
      "address": "Full Address"
    }
  ],
  "routes": [
    {
      "id": "route-001",
      "departureParkId": "park-001",
      "departureParkName": "Park Name",
      "destination": "Destination",
      "estimatedFareMin": 1000,
      "estimatedFareMax": 2000,
      "routeName": "Route Name"
    }
  ],
  "transportUnions": [
    {
      "name": "Union Name",
      "contactPhone": "+234-xxx-xxx-xxxx",
      "email": "email@example.com"
    }
  ]
}
```

## Customization

### Adding New Bus Parks
Edit `data/bus-data.json` and add new entries to the `busParks` array. Make sure to:
- Use unique IDs
- Include valid latitude and longitude coordinates
- Match transport union names with entries in `transportUnions`

### Adding New Routes
Edit `data/bus-data.json` and add new entries to the `routes` array. Make sure to:
- Use unique IDs
- Reference valid `departureParkId` values
- Include fare ranges in Nigerian Naira (₦)

### Styling

The application uses a modern, clean design with comprehensive styling:

#### Routes Section Styling
The routes page features specially designed route cards with:
- **Route Cards**: Each route is displayed in a card with:
  - Left border accent that appears on hover
  - Destination with location indicator
  - Prominent fare range badge with gradient background
  - Departure park and route name information
  - Smooth hover animations and transitions
  - Responsive grid layout that adapts to screen size

- **Visual Elements**:
  - Gradient fare badges (orange theme)
  - Hover effects with subtle background gradient
  - Touch-friendly tap targets (minimum 44px)
  - Clear typography hierarchy
  - Consistent spacing and padding

- **Responsive Behavior**:
  - Desktop: Multi-column grid (3-4 columns)
  - Tablet: 2 columns with adjusted spacing
  - Mobile: Single column, full-width cards
  - Fare badges expand to full width on mobile

#### General Styling
Modify `css/style.css` to customize:
- Colors (CSS variables in `:root`)
- Layout and spacing
- Typography
- Responsive breakpoints
- Route card styles (see "Routes Section Styling" comments in CSS)

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design

The application is fully responsive and optimized for all device types with comprehensive breakpoints:

### Device Support
- **Large Desktop**: 1025px and above (3-4 column layouts)
- **Desktop/Tablet Landscape**: 769px - 1024px (2-3 column layouts)
- **Tablet Portrait**: 481px - 768px (1-2 column layouts)
- **Mobile**: ≤ 480px (single column, optimized for touch)

### Responsive Features

#### Routes Page
- **Desktop**: Grid layout with 3-4 columns (350px minimum per card)
- **Tablet**: 2 columns with adjusted spacing
- **Mobile**: Single column with full-width cards
- Route cards feature:
  - Hover animations with left border accent
  - Responsive fare badges
  - Touch-friendly tap targets
  - Optimized typography for readability

#### Parks Page
- **Desktop**: Grid layout with 3-4 columns (320px minimum per card)
- **Tablet**: 2 columns
- **Mobile**: Single column with stacked layout

#### Navigation
- **Desktop**: Horizontal navigation bar
- **Mobile**: Stacked navigation with centered alignment
- Sticky header for easy access on all pages

#### Search & Filters
- **Desktop**: Horizontal layout with inline filters
- **Mobile**: Stacked vertical layout with full-width inputs
- Touch-optimized buttons and form elements

#### Maps
- **Desktop**: 450px height
- **Tablet**: 300px height
- **Mobile**: 250px height
- Fully responsive with proper viewport handling

### CSS Architecture
- CSS Custom Properties (Variables) for easy theming
- Mobile-first approach with progressive enhancement
- Flexible Grid and Flexbox layouts
- Smooth transitions and animations
- Consistent spacing system

## Deployment

### GitHub Pages
1. Push the project to a GitHub repository
2. Go to repository Settings > Pages
3. Select the branch and folder (usually `main` and `/root`)
4. The site will be available at `https://username.github.io/repository-name`

### Netlify
1. Drag and drop the project folder to Netlify
2. Or connect your GitHub repository
3. Netlify will automatically deploy the site

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts

### Other Hosting Services
Any static hosting service will work:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Any web server with static file hosting

## Future Enhancements

Potential improvements for future versions:
- Backend API integration
- Real-time fare updates
- User reviews and ratings
- Booking functionality
- Route planning
- Multiple language support
- Dark mode
- Offline support with service workers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available for educational purposes.

## Contact

For questions or support, please open an issue in the repository.

## Screenshots

Note: Screenshots of all pages and features should be taken and added to a `screenshots/` folder. The application includes:
- Home page with search and featured content
- Parks page with filtering
- Routes page with route listings
- Details page with map integration

## Acknowledgments

- Leaflet.js for map functionality
- OpenStreetMap for map tiles
- All contributors and testers

---

**Last Updated:** 2024
