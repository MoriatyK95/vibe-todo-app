# Vibe Todo App

[![CI](https://github.com/MoriatyK95/vibe-todo-app/workflows/CI/badge.svg)](https://github.com/MoriatyK95/vibe-todo-app/actions/workflows/ci.yml)
[![Deploy](https://github.com/MoriatyK95/vibe-todo-app/workflows/Deploy/badge.svg)](https://github.com/MoriatyK95/vibe-todo-app/actions/workflows/deploy.yml)
[![Code Quality](https://github.com/MoriatyK95/vibe-todo-app/workflows/Code%20Quality/badge.svg)](https://github.com/MoriatyK95/vibe-todo-app/actions/workflows/quality.yml)

A modern, calendar-based todo application built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- **Calendar View**: Interactive monthly calendar with clickable dates
- **Date-specific Todos**: Separate todo lists for each day
- **Overview Dashboard**: View all upcoming todos with statistics
- **Visual Indicators**: Green dots show days with todos
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode Support**: Automatic dark/light theme adaptation
- **Modern UI**: Clean, intuitive interface with smooth transitions

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MoriatyK95/vibe-todo-app.git
cd vibe-todo-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run ci` - Run full CI pipeline (lint + type-check + build)
- `npm run format` - Format code with Prettier
- `npm run format-check` - Check code formatting

## 🏗️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Linting**: [ESLint](https://eslint.org/)
- **Formatting**: [Prettier](https://prettier.io/)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)

## 📱 Usage

### Calendar View
- Click on any date to view/manage todos for that day
- Today's date is highlighted in blue
- Selected date has a blue background
- Days with todos show a small green indicator dot

### Overview Dashboard
- Switch to "Overview" tab to see all upcoming todos
- View statistics: total, completed, pending, and active days
- Click the calendar icon (📅) to jump to a specific date
- Manage todos directly from the overview

### Adding Todos
- Type in the input field and press Enter or click "Add"
- Todos are automatically saved for the selected date

### Managing Todos
- Click checkbox to mark as complete/incomplete
- Click "Delete" to remove a todo
- Use the overview to see all upcoming items

## 🚀 Deployment

The app is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. The static files will be generated in the `out` directory

3. Deploy the `out` directory to your hosting platform

## 🔧 CI/CD Pipeline

The repository includes three GitHub Actions workflows:

### CI Workflow (`ci.yml`)
- Runs on every push and pull request
- Tests across Node.js versions 18.x, 20.x, and 22.x
- Executes linting, type checking, and builds
- Includes security audit checks

### Deploy Workflow (`deploy.yml`)
- Automatically deploys to GitHub Pages on main branch pushes
- Builds and exports static files
- Uses GitHub's built-in GITHUB_TOKEN for authentication

### Quality Workflow (`quality.yml`)
- Checks code formatting with Prettier
- Scans for TODO/FIXME comments
- Analyzes bundle size
- Checks for dependency updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run the CI pipeline locally: `npm run ci`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Open a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies and best practices.

---

🤖 Generated with [Claude Code](https://claude.ai/code)
