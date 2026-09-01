# Graph Report - /Users/sahilshekhawat/Movies/SS edits/car  (2026-08-13)

## Corpus Check
- Corpus is ~12,855 words - fits in a single context window. You may not need a graph.

## Summary
- 279 nodes · 473 edges · 15 communities
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Frontend App & Pages
- Server Dependencies
- Booking & User Management
- Authentication Flow
- Client Dependencies
- Host & Car Models
- Server Core & Chat
- Frontend Layout & API
- Car Management & Uploads
- Payments
- Server Scripts
- Reviews
- Frontend Documentation

## God Nodes (most connected - your core abstractions)
1. `authMiddleware()` - 12 edges
2. `Car` - 11 edges
3. `currency()` - 10 edges
4. `User` - 9 edges
5. `Booking` - 8 edges
6. `setTokenCookie()` - 7 edges
7. `adminMiddleware()` - 6 edges
8. `scripts` - 4 edges
9. `saveMember()` - 4 edges
10. `DriveOn Frontend Overview` - 4 edges

## Surprising Connections (you probably didn't know these)
- `TripCard()` --calls--> `currency()`  [EXTRACTED]
  client/src/pages.jsx → client/src/data/cars.js
- `DriveOn Frontend Overview` --conceptually_related_to--> `DriveOn Index HTML Entrypoint`  [INFERRED]
  client/README.md → client/index.html
- `CarCard()` --calls--> `currency()`  [EXTRACTED]
  client/src/components/CarCard.jsx → client/src/data/cars.js
- `Header()` --calls--> `clearMember()`  [EXTRACTED]
  client/src/components/Layout.jsx → client/src/services/session.js
- `Header()` --calls--> `getMember()`  [EXTRACTED]
  client/src/components/Layout.jsx → client/src/services/session.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Client Frontend Entrypoint and Configuration Bootstrap** — client_readme_driveon_frontend, client_index_html_document, client_index_main_script [INFERRED 0.85]

## Communities (15 total, 0 thin omitted)

### Community 0 - "Frontend App & Pages"
Cohesion: 0.07
Nodes (40): App(), CarCard(), hostNav, PortalLayout(), userNav, cars, currency(), About() (+32 more)

### Community 1 - "Server Dependencies"
Cohesion: 0.05
Nodes (41): bcryptjs, cloudinary, cookie-parser, cors, crypto, dotenv, express, express-mongo-sanitize (+33 more)

### Community 2 - "Booking & User Management"
Cohesion: 0.12
Nodes (19): bookCar(), cancelBooking(), getAllBookings(), getBookedDates(), getMyBookings(), updateBookingStatus(), getDashboardStats(), getProfile() (+11 more)

### Community 3 - "Authentication Flow"
Cohesion: 0.15
Nodes (19): clearTokenCookie(), COOKIE_OPTIONS, setTokenCookie(), admin, serviceAccount, transporter, forgotPassword(), getMe() (+11 more)

### Community 4 - "Client Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, lucide-react, react, react-dom, react-router-dom, devDependencies, vite, @vitejs/plugin-react (+14 more)

### Community 5 - "Host & Car Models"
Cohesion: 0.18
Nodes (9): applyForHost(), getHostBookings(), getHostCars(), getHostDashboard(), hostOrAdminMiddleware(), Car, carSchema, router (+1 more)

### Community 6 - "Server Core & Chat"
Cohesion: 0.16
Nodes (11): connectDB(), handleChat(), getFavorites(), toggleFavorite(), app, router, router, router (+3 more)

### Community 7 - "Frontend Layout & API"
Cohesion: 0.22
Nodes (7): Header(), navItems, PageShell(), authApi, carApi, clearMember(), getMember()

### Community 8 - "Car Management & Uploads"
Cohesion: 0.27
Nodes (9): addCar(), ALLOWED_CAR_FIELDS, deleteCar(), getCarById(), getCars(), pickAllowedFields(), updateCar(), storage (+1 more)

### Community 9 - "Payments"
Cohesion: 0.26
Nodes (8): razorpay, createOrder(), getPaymentHistory(), getPaymentReceipt(), verifyPayment(), Payment, paymentSchema, router

### Community 10 - "Server Scripts"
Cohesion: 0.18
Nodes (10): nodemon, devDependencies, nodemon, main, name, scripts, server, start (+2 more)

### Community 11 - "Reviews"
Cohesion: 0.36
Nodes (5): addReview(), getCarReviews(), Review, reviewSchema, router

### Community 12 - "Frontend Documentation"
Cohesion: 0.29
Nodes (7): DriveOn Index HTML Entrypoint, Main JSX Module Script Tag, React Application Mount Point Root Element, Client Application Component and Service Structure, DriveOn Frontend Overview, VITE_API_URL Environment Variable, Vite Dev Server API Proxy Configuration

## Knowledge Gaps
- **65 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Server Dependencies` to `Server Scripts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `Car` connect `Host & Car Models` to `Booking & User Management`, `Server Core & Chat`, `Car Management & Uploads`, `Payments`, `Reviews`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `authMiddleware()` connect `Booking & User Management` to `Authentication Flow`, `Host & Car Models`, `Server Core & Chat`, `Car Management & Uploads`, `Payments`, `Reviews`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `authMiddleware()` (e.g. with `auth.route.js` and `booking.route.js`) actually correct?**
  _`authMiddleware()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend App & Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.06778476589797344 - nodes in this community are weakly interconnected._
- **Should `Server Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._