# SUPRA SAEINDIA Cost Report Application

A professional cost report application for SUPRA SAEINDIA competitions, designed to help teams calculate and manage costs for Parts and Assemblies efficiently.

## Features

- **Separate Parts & Assemblies Management**: Create and manage multiple Parts and Assemblies independently
- **Comprehensive Cost Categories**: 
  - Materials
  - Fasteners
  - Assembly Operations
  - Processes
  - Tooling
- **Excel Export**: Export detailed cost reports with separate sheets for Parts and Assemblies
- **Custom Items**: Add custom materials, fasteners, processes, tooling, and assemblies
- **Real-time Cost Calculation**: Automatic cost updates as you modify items
- **Local Storage Persistence**: Your data is saved automatically in the browser
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Apple Health-inspired UI**: Clean, modern, and professional interface

## Getting Started

### Online Usage

1. Visit the deployed version of the app
2. Start adding Parts and Assemblies
3. Add items to each Part/Assembly with their respective costs
4. Export your cost report as an Excel file

### Offline Usage (Mobile/Desktop)

You can use this app offline on your phone or computer as a web app:

**On Mobile (iOS/Android):**
1. Open the app in your browser (Chrome, Safari, etc.)
2. Tap the browser menu (three dots or share icon)
3. Select "Add to Home Screen" or "Install App"
4. The app will be added to your home screen like a native app
5. You can now use it offline - it will load from your device's cache

**On Desktop:**
1. Open the app in your browser
2. The app will cache automatically
3. You can use it offline by reloading the page (if cached)

## How to Use

### 1. Set Global Header Information
- University
- Team Name
- Car #
- System

### 2. Create Parts
- Click "Add Part" button
- Enter Assembly Name and Part Name
- Add External Cost if applicable
- Click "Add Item" to add cost items

### 3. Create Assemblies
- Click "Add Assembly" button
- Enter Assembly Name and Part Name
- Add External Cost if applicable
- Click "Add Item" to add cost items

### 4. Add Cost Items
For each Part/Assembly, you can add:
- **Materials**: Select from database or add custom
- **Fasteners**: Select from database or add custom
- **Assembly Operations**: Select from database or add custom
- **Processes**: Select from database or add custom
- **Tooling**: Select from database or add custom

### 5. Export Excel Report
- Click "Export Excel" button
- The file will contain:
  - Parts sheet with all Parts and their cost breakdowns
  - Assemblies sheet with all Assemblies and their cost breakdowns
  - Each Part/Assembly has its own header and cost tables

## Cost Data

The app includes comprehensive cost databases for:
- Materials (with categories like Bearings, Brake System, Chassis, Composites, etc.)
- Fasteners (bolts, nuts, rivets, washers, etc.)
- Processes (machining, forming, coating, etc.)
- Tooling (dies, molds, etc.)
- Assembly Operations
- Multipliers for process calculations

## Technical Details

- **Built with**: React + Vite
- **Styling**: Custom CSS with Apple Health-inspired design
- **Excel Export**: xlsx library
- **Data Persistence**: LocalStorage
- **Responsive**: Mobile-first design

## Deployment

The app can be deployed to any static hosting platform:
- Vercel
- Netlify
- GitHub Pages
- Or any other static hosting service

Simply connect your GitHub repository to the platform and it will auto-deploy.

## Version

- Version: 1.0
- Cost Tables: 2026
- Developed by: not-brajesh

## License

This application is for SUPRA SAEINDIA competition use.

## Support

For issues or questions, please contact the development team.
