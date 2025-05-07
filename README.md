# HeavyMetal 🔨

## General Overview 🛍️

Welcome to HeavyMetal, your digital armory for all things metallic! ⚔️

- [Our Mission](#our-mission-) 🔥
- [Key Features](#key-features-of-heavymetal-include-%EF%B8%8F) 🗝️
- [Technical Stack](#technical-stack-) 💻
- [How to Run the Project Locally](#how-to-run-the-project-locally-%EF%B8%8F) ⚙️
- [Git Workflow](#git-workflow-) 🔄
- [Available Scripts](#available-scripts-) 📑
- [Contact us](#contact-us-) 📩

### Our Mission 🔥

At HeavyMetal, we're on a mission to deliver premium quality metal products, tools, and equipment. Our curated collection features a diverse array of weapons, armor, tools, and accessories, meticulously selected to cater to both casual buyers and dedicated collectors alike. Whether you're looking to protect yourself or deal some damage, HeavyMetal has everything you need to outfit yourself with the finest metalwork.

Our modern and industrial website offers a sleek and intuitive shopping experience, designed to showcase the craftsmanship of our products. From our clean UI to our seamless navigation, we're committed to making your shopping experience as effortless and enjoyable as possible.

### Key Features of HeavyMetal Include 🗝️

⚔️ **Premium Quality Selection**: Explore our extensive catalog of metal products, weapons, tools, and equipment, handpicked to ensure the highest quality and craftsmanship.

🛡️ **Product Categories**: Browse through categories including weapons, armor, tools, decorative items, and accessories.

🔎 **Advanced Search & Filtering**: Find exactly what you're looking for with our robust search and filtering system.

🧭 **User-friendly Navigation**: Our intuitive navigation system makes it easy to find the products you need.

🔒 **Secure Checkout**: Shop with confidence with our secure payment processing.

🖼️ **Responsive Design**: Whether you're browsing on a desktop, tablet, or smartphone, our website adapts seamlessly to provide a visually stunning and immersive experience on any device.

## Technical Stack 💻

_In our project we use the following technologies:_

- **Frontend**:

  - [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/) for building dynamic user interfaces
  - [Next.js](https://nextjs.org/) for server-side rendering and optimized performance
  - [Shadcn/ui](https://ui.shadcn.com/) for beautifully designed UI components
  - [Framer Motion](https://www.framer.com/motion/) for smooth animations and transitions
  - [SASS](https://sass-lang.com/) for advanced styling capabilities 🎨
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

- **Backend**: Supported by [CommerceTools](https://commercetools.com/), a leading provider of commerce solutions, offering a robust and scalable platform for creating immersive digital commerce experiences 🌐

- **CI/CD**: Integrates [GitHub Actions](https://github.com/features/actions) for continuous integration and deployment 🚀

- **Code Quality**: Ensures code quality through rigorous checks with [Husky](https://typicode.github.io/husky/), [Prettier](https://prettier.io/), [ESLint](https://eslint.org/), [Perfectionist](https://eslint-plugin-perfectionist.azat.io/), [Stylelint](https://stylelint.io/), and [EditorConfig](https://editorconfig.org/) 🐶

- **Testing**: Conducts thorough testing with [Vitest](https://vitest.dev/) and [Mock Service Worker](https://mswjs.io/) ⚡

- **Project Architecture**: Follows Next.js App Router architecture for efficient, scalable development with React Server Components 🌍

## How to Run the Project Locally ⚙️

_To run the project locally, follow these steps:_

1. Clone the repository: `git clone https://github.com/RSS-ECOM/rss-ecom`
2. Navigate to the project directory: `cd rss-ecom`
3. Install dependencies: `npm install`
4. Create a `.env` file based on `.env.example` and fill in your CommerceTools credentials
5. Run the project: `npm run dev`

## Git Workflow 🔄

This project follows a modified Git Flow workflow:

1. **Main Branch**: Production-ready code
2. **Develop Branch**: Primary development branch where all features are integrated
3. **Feature Branches**: Created from `develop` for specific tasks

### Branch Naming Convention

All branches should follow this pattern: `{type}(RSS-ECOMM-{sprint}_{issue})/descriptiveName`

Where:

- `{type}` is one of: feat, fix, hotfix, chore, refactor, revert, docs, style, test
- `{sprint}` is the sprint number
- `{issue}` is the issue number

Examples:

- `feat(RSS-ECOMM-1_01)/addProductPage`
- `fix(RSS-ECOMM-2_15)/correctCartTotal`

### Pull Requests

All code changes should be submitted via pull requests to the `develop` branch. PRs should:

- Have a descriptive title following the same convention as branch names
- Include a comprehensive description of changes
- Be reviewed by at least one team member before merging

## Environment Setup 🔧

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Environment Variables

This project uses environment variables for configuration. Create a `.env.local` file based on `.env.example` with the following variables:

```bash
# CommerceTools Configuration
NEXT_PUBLIC_CTP_PROJECT_KEY=your-project-key
NEXT_PUBLIC_CTP_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_CTP_CLIENT_ID=your-client-id
NEXT_PUBLIC_CTP_REGION=eu-central-1
NEXT_PUBLIC_CTP_AUTH_URL=https://auth.eu-central-1.aws.commercetools.com
NEXT_PUBLIC_CTP_API_URL=https://api.eu-central-1.aws.commercetools.com
NEXT_PUBLIC_CTP_SCOPES=view_published_products:your-project manage_my_profile:your-project ...
```

Important: Never commit the .env.local file to version control.

### Recommended VS Code Extensions

For the best development experience, we recommend installing the following VS Code extensions:

- **ESLint** (`dbaeumer.vscode-eslint`): JavaScript linting
- **Prettier** (`esbenp.prettier-vscode`): Code formatting
- **Stylelint** (`stylelint.vscode-stylelint`): CSS/SCSS linting
- **GitHub Actions** (`github.vscode-github-actions`): GitHub Actions workflows syntax highlighting and validation
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`): Intelligent Tailwind CSS tooling
- **SCSS IntelliSense** (`mrmlnc.vscode-scss`): SCSS IntelliSense support
- **DotENV** (`mikestead.dotenv`): .env file support

## CI/CD Pipeline 🚀

This project uses GitHub Actions for Continuous Integration and Netlify for Continuous Deployment:

### Continuous Integration

Our CI process includes:

- Code formatting check with Prettier
- Linting with ESLint and Stylelint
- Type checking with TypeScript
- Testing with Vitest (when tests are available)
- Building the application

### Continuous Deployment

After successful merges to `main` or `develop`, the application is automatically deployed to Netlify.

### Dependency Management

We use [Renovate](https://docs.renovatebot.com/) to keep dependencies up to date:

- Renovate automatically creates pull requests when updates are available
- Dependencies are grouped by type (e.g., Next.js packages, TypeScript, etc.)
- All dependency updates require approval through the Dependency Dashboard

## Working with CommerceTools 🛒

This project uses CommerceTools as the backend for e-commerce functionality. The connection is managed through the CommerceTools SDK.

### Authentication

The application uses Client Credentials flow for authentication with CommerceTools API:

```typescript
// In Next.js with prefix NEXT_PUBLIC_ secrets are available on the client
const apiKey = process.env.NEXT_PUBLIC_CTP_PROJECT_KEY;

// For server-side components you can use ordinary variables
// If you don't want the secret to be available on the client, do not use NEXT_PUBLIC_
const apiSecret = process.env.CTP_CLIENT_SECRET; // only on server

// Basic usage example
import { apiRoot } from '@/lib/api/commercetools-client';

// Get products
export async function GET() {
  try {
    const response = await apiRoot.products().get().execute();

    return Response.json(response.body.results);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
```

For detailed API documentation, visit the CommerceTools Documentation.

## Available Scripts 📑

_You can run the following scripts in the project directory:_

- `npm run dev`: Starts the Next.js development server
- `npm run build`: Builds the application for production
- `npm run start`: Runs the built application in production mode
- `npm run lint`: Lints the codebase using ESLint
- `npm run lint:fix`: Automatically fixes linting errors in TypeScript files
- `npm run format`: Formats code with Prettier
- `npm run format:check`: Checks if code formatting meets Prettier standards
- `npm run stylelint`: Lints CSS and SCSS files
- `npm run stylelint:fix`: Automatically fixes styling issues
- `npm run prepare`: Sets up Husky git hooks
- `npm run test`: Runs tests with Vitest
- `npm run test-ui`: Runs tests with the Vitest UI
- `npm run coverage`: Generates test coverage reports
- `npm run generate`: Creates new components using our template system
- `npm run typecheck`: Performs TypeScript type checking

## Contact us 📩

- 🧙‍♂️ Oleksii Ostapenko (GitHub: [harmon1c](https://github.com/harmon1c))
- 🧙‍♂️ Denis Yeresko (GitHub: [dyeresko](https://github.com/dyeresko))
- 🧙‍♀️ Julia Vasilko (GitHub: [JuliaVasilko](https://github.com/JuliaVasilko))

Project Repository: [https://github.com/RSS-ECOM/rss-ecom](https://github.com/RSS-ECOM/rss-ecom)
