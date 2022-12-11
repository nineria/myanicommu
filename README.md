# My Anime Community

[https://myanimecommunity.vercel.app](https://myanimecommunity.vercel.app)

<div align='center'>
<img src="https://myanimecommunity.vercel.app/background.png">
</div>

## Description

My Anime Community website purpose is to bring together people who like anime. They can come in and talk and exchange knowledge about anime, manga and light novels.

## Stack

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Firebase](https://firebase.google.com/) - Cross-platform SDKs documentation help you build and ship apps on Android, iOS and Website
- [Mantine](https://mantine.dev/) - Mantine core library includes all essential components: inputs, buttons, modals, popovers, typography elements, layout management, etc.
- [React Simple Animate](https://react-simple-animate.vercel.app/) - UI Animation Made Simple
- [Tabler Icons](https://github.com/tabler/tabler-icons) - Pixel-perfect icons for web design

## Project structure

```
$PROJECT_ROOT
├── components                  # React component files
│   ├── Animate                 # Website Animation stuff
│   ├── Announcement            # Announcement component
│   ├── Card                    # Post card
│   ├── CommentComponents       # Comment component (CRUD)
│   ├── Dropzone                # Drag and drop image
│   ├── HomeComponents          # Home components (CRUD)
│   ├── LoginRegister           # Login and register components
│   ├── Navbar                  # Navigation component
│   ├── PostComponents          # Post components
│   ├── ProfileComponents       # User profile component
│   ├── SettingComponents       # Setting, Theme etc.
│   ├── WebsiteRule             # Website rule component
│   ├── ADSide                  # Image on both sides of the website
│   ├── Footer                  # Footer component
│   ├── Loading                 # Display loading animation
│   ├── Logo                    # Website logo
│   ├── Metatags                # Meta tag
│   ├── PrivacyPolicy           # Website Privacy Policy
│   ├── UserReport              # Report component
│   ├── Verify                  # Verify user (viewer, admin, member)
├── constants                   # Store constants data and testing
│   ├── Advertisement.js        # Website announcement mockup data
│   ├── FAQ                     # Text for the FAQ page
│   ├── NavbarData.sj           # Navigation data
│   ├── StatsSegmentsColor.js   # Constant value for color (use for testing)
│   ├── Themes.js               # Website themes data
├── hooks                       # User identifier
│   ├── AdminCheck.js           # Identify an admin user
│   ├── AuthCheck.js            # Authentication
│   ├── AuthorCheck.js          # Check post owner
├── lib                         # Non-react modules
│   ├── context.js              # User context for website
│   ├── firebase.js             # Firebase stuff
│   ├── hooks.js                # Auth record and user profile doc
│   ├── useTheme.js             # Themes context
├── pages                       # Page files
│   ├── [username]              # User profile page (dynamic)
│   ├── posts                   # All posts page
│   │   ├── [username]          # Post page (dynamic)
│   ├── _app.js                 # Entry point
│   ├── 404.js                  # 404 page not found
│   ├── faq                     # Frequently asked questions (FAQ) page
│   ├── index.js                # Home page
│   ├── qandas.js               # Q&A page
│   ├── reviews.js              # Review page
│   ├── search.js               # Search page
│   ├── setting.js              # Setting page
├── public                      # Static files for images, video, 3d model etc.
├── styles                      # Website global styles
├── utils                       # javascript utils function for convert, calculate etc.
```

## How to dev

We recommend using [yarn](https://yarnpkg.com/) for package managers.

1. Install all dependencies using `yarn` or `npm`

   ```powershell
   yarn
   ```

   or

   ```powershell
   npm install
   ```

2. Run the project

   ```powershell
   yarn dev
   ```

   or

   ```powershell
   npm run dev
   ```

## License

GPL-3.0 license
