# Todo App Demo

A modern, feature-rich Todo application built with React, TypeScript, and Redux Toolkit. This demo project showcases best practices in React development, state management, and modern web development tools.

## 🚀 Features

- Modern React with TypeScript
- Redux Toolkit for state management
- Local storage persistence using LocalForage
- Responsive design with Tailwind CSS
- Virtual scrolling for large lists
- Font Awesome icons integration
- Comprehensive test suite with Vitest
- ESLint for code quality
- Vite for fast development and building

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Routing:** React Router v7
- **Styling:** Tailwind CSS + SASS
- **Icons:** Font Awesome + React Icons
- **Storage:** LocalForage
- **Testing:** Vitest + Testing Library
- **Build Tool:** Vite
- **Code Quality:** ESLint

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd todo-repo-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_APP_TITLE=Todo App
VITE_APP_API_URL=http://localhost:3000
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts
├── lib/           # Utility functions and helpers
├── routes/        # Route definitions
├── services/      # API and service layer
├── store/         # Redux store configuration
├── test/          # Test files
└── views/         # Page components
```

## 🧪 Testing

The project uses Vitest for testing. You can run tests using:

```bash
npm run test
```

For UI-based test runner:

```bash
npm run test:ui
```

### Test Coverage

The project maintains a minimum test coverage of:
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## 🎨 Styling

The project uses Tailwind CSS for utility-first styling and SASS for custom styles. The main styles are defined in `src/index.scss`.

### Style Guidelines

- Use Tailwind utility classes for common styling
- Create custom components for reusable UI elements
- Follow BEM naming convention for custom CSS classes
- Use CSS variables for theme colors and common values

## 💻 Development Workflow

1. Create a new branch for your feature/fix
2. Make your changes
3. Write/update tests
4. Run the test suite
5. Submit a pull request

## 🤝 Contributing

This is a demo project, but if you'd like to contribute or have suggestions, please feel free to open an issue or submit a pull request.

## 📝 Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use functional components with hooks
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 