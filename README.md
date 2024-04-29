# T6 Deco Chess
## Application Name: Deco Chess
## Team Members
Isabella Bates, Cole Downs, Emma Kalikstein, 
Jackson Stepka, Paul Tracy, Mathias Labuszewski

## Project Description
We want to create a chess-playing website where users: can play against another person, can player against a chess AI, and customize their profile page. 

## Vision Statement: 
“Bringing creativity and style to chess”

## Usage:
1. Download docker desktop
2. Download git repo
3. Navigate to ProjectSourceCode
4. Run ' docker-compose up '
5. Navigate to [localhost 3000](http://localhost:3000/) on browser

### Changelog
04/09/2024 Implemented movement of peices and database endpoints\
04/07/2024 Update game page and login pages, added endpoints\
04/05/2024 Implemented user functonality for session\
04/03/2024 Redesigned directory structure, created database\
04/02/2024 Added docker compose file\
04/01/2024 Developed Handlbars\
03/31/2024 Migrated the website\ 
03/29/2024 Designed the website's outlines \

###  File Tree
├── MilestoneSubmissions 
├── ProjectSourceCode
│   │   ├── package.json
│   ├── package-lock.json
│   ├── src
│   │   ├── css
│   │   │   ├── boardCSS.css
│   │   │   └── variousRules.css
│   │   ├── index.js
│   │   ├── init_data
│   │   │   └── init.sql
│   │   ├── js
│   │   │   ├── callbacks.js
│   │   │   ├── chessHandler.js
│   │   │   └── timer.js
│   │   ├── resources
│   │   │   └── img
│   │   │       ├── Chess-Background-photo.jpg
│   │   │       ├── Profile-Background-photo.jpg
│   │   │       └── svgs
│   │   │           └── basic-set
│   │   │               ├── black_bishop.svg
│   │   │               ├── black_king.svg
│   │   │               ├── black_knight.svg
│   │   │               ├── black_pawn.svg
│   │   │               ├── black_queen.svg
│   │   │               ├── black_rook.svg
│   │   │               ├── white_bishop.svg
│   │   │               ├── white_king.svg
│   │   │               ├── white_knight.svg
│   │   │               ├── white_pawn.svg
│   │   │               ├── white_queen.svg
│   │   │               └── white_rook.svg
│   │   └── views
│   │       ├── layouts
│   │       │   └── main.hbs
│   │       ├── pages
│   │       │   ├── game.hbs
│   │       │   ├── home.hbs
│   │       │   ├── login.hbs
│   │       │   ├── logout.hbs
│   │       │   ├── playType.hbs
│   │       │   ├── profile.hbs
│   │       │   └── register.hbs
│   │       └── partials
│   │           ├── chessBoard.hbs
│   │           ├── footer.hbs
│   │           ├── head.hbs
│   │           ├── message.hbs
│   │           ├── navbar.hbs
│   │           ├── nav.hbs
│   │           └── title.hbs
│   └── test
│       └── server.spec.js
├── readme.md
└── TeamMeetingLogs
    ├── meeting_1.txt
    ├── meeting_2.txt
    ├── meeting_3.txt
    └── meeting_4.txt
