/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-names */
module.exports = function (plop) {
  // Component Generator
  plop.setGenerator('component', {
    actions(data) {
      const actions = [
        {
          path: `src/{{folderName}}/{{componentName}}/{{componentName}}.tsx`,
          templateFile: data.isClient
            ? 'src/templates/ReactComponent/ClientComponent.tsx'
            : 'src/templates/ReactComponent/Component.tsx',
          type: 'add',
        },
        {
          path: `src/{{folderName}}/{{componentName}}/{{componentName}}.module.scss`,
          templateFile: 'src/templates/ReactComponent/Component.module.scss',
          type: 'add',
        },
        {
          path: `src/{{folderName}}/{{componentName}}/index.ts`,
          templateFile: 'src/templates/ReactComponent/index.ts',
          type: 'add',
        },
      ];

      // Add test file if needed
      if (data.needsTests) {
        actions.push({
          path: `src/{{folderName}}/{{componentName}}/{{componentName}}.test.tsx`,
          template: `import { render, screen } from '@testing-library/react';
import {{componentName}} from './{{componentName}}';

describe('{{componentName}}', () => {
  it('renders correctly', () => {
    render(<{{componentName}} />);
    
    // Add your test assertions here
  });
});`,
          type: 'add',
        });
      }

      // Add the hook file if needed
      if (data.needsHook) {
        actions.push({
          path: `src/{{folderName}}/{{componentName}}/use{{componentName}}Data.ts`,
          templateFile: 'src/templates/ReactComponent/useComponentData.ts',
          type: 'add',
        });
      }

      // Customize template data
      const templateData = {
        ...data,
        stylesName: `${data.componentName}.module.scss`,
      };

      return actions.map((action) => ({ ...action, data: templateData }));
    },
    description: 'Generate a new React component',
    prompts: [
      {
        choices: [
          { name: 'UI Components', value: 'components/ui' },
          { name: 'Layout Components', value: 'components/layout' },
          { name: 'Form Components', value: 'components/forms' },
          { name: 'Feature Components', value: 'features' },
          { name: 'Entity Components', value: 'entities' },
          { name: 'Widget Components', value: 'widgets' },
        ],
        message: 'Choose the component type:',
        name: 'folderName',
        type: 'rawlist',
      },
      {
        message: 'Enter the component name (PascalCase):',
        name: 'componentName',
        type: 'input',
      },
      {
        default: false,
        message: 'Does this component need state management/data fetching?',
        name: 'needsHook',
        type: 'confirm',
      },
      {
        default: true,
        message: 'Is this a client component (with interactivity)?',
        name: 'isClient',
        type: 'confirm',
      },
      {
        default: true,
        message: 'Do you want to create test files?',
        name: 'needsTests',
        type: 'confirm',
      },
    ],
  });

  // Page Generator
  plop.setGenerator('page', {
    actions(data) {
      const actions = [];

      // Add page file
      actions.push({
        path: data.isDynamic ? `src/app/{{routePath}}/[id]/page.tsx` : `src/app/{{routePath}}/page.tsx`,
        template: `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '{{pageTitle}} | Heavy Metal',
  description: '{{pageDescription}}',
};

export default function {{pascalCase routePath}}Page(): JSX.Element {
  return (
    <main className="main-content">
      <div className="container">
        <h1>{{pageTitle}}</h1>
        {/* Page content */}
      </div>
    </main>
  );
}`,
        type: 'add',
      });

      // Add layout if requested
      if (data.needsLayout) {
        actions.push({
          path: `src/app/{{routePath}}/layout.tsx`,
          template: `import type { ReactNode } from 'react';

interface {{pascalCase routePath}}LayoutProps {
  children: ReactNode;
}

export default function {{pascalCase routePath}}Layout({ 
  children 
}: {{pascalCase routePath}}LayoutProps): JSX.Element {
  return (
    <section className="{{dashCase routePath}}-layout">
      {children}
    </section>
  );
}`,
          type: 'add',
        });
      }

      return actions;
    },
    description: 'Generate a Next.js page',
    prompts: [
      {
        message: 'Enter route path (e.g., "products" or "products/categories"):',
        name: 'routePath',
        type: 'input',
      },
      {
        default: false,
        message: 'Is this a dynamic route with [id]?',
        name: 'isDynamic',
        type: 'confirm',
      },
      {
        default: false,
        message: 'Does this route need a layout?',
        name: 'needsLayout',
        type: 'confirm',
      },
      {
        message: 'Enter page title:',
        name: 'pageTitle',
        type: 'input',
      },
      {
        message: 'Enter page description:',
        name: 'pageDescription',
        type: 'input',
      },
    ],
  });

  // Error Page Generator
  plop.setGenerator('error-page', {
    actions(data) {
      const path = data.routePath ? `src/app/${data.routePath}/${data.errorType}.tsx` : `src/app/${data.errorType}.tsx`;

      let template = '';

      switch (data.errorType) {
        case 'not-found':
          template = `export default function NotFound(): JSX.Element {
return (
  <main className="error-container">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </main>
);
}`;
          break;
        case 'error':
          template = `'use client';

import { useEffect } from 'react';

interface ErrorProps {
error: Error;
reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
useEffect(() => {
  // Log the error to an error reporting service
  console.error(error);
}, [error]);

return (
  <div className="error-container">
    <h2>Something went wrong!</h2>
    <button
      onClick={reset}
      className="reset-button"
    >
      Try again
    </button>
  </div>
);
}`;
          break;
        case 'loading':
          template = `export default function Loading(): JSX.Element {
return (
  <div className="loading-container">
    <div className="loading-spinner" />
    <p>Loading...</p>
  </div>
);
}`;
          break;
        default:
          template = `export default function ErrorPage(): JSX.Element {
return (
  <div className="error-container">
    <h1>Error Page</h1>
    <p>Something unexpected happened.</p>
  </div>
);
}`;
          break;
      }

      return [
        {
          path,
          template,
          type: 'add',
        },
      ];
    },
    description: 'Generate a Next.js error handling page',
    prompts: [
      {
        choices: [
          { name: 'Not Found (404)', value: 'not-found' },
          { name: 'Error', value: 'error' },
          { name: 'Loading', value: 'loading' },
        ],
        message: 'What type of error page do you want to create?',
        name: 'errorType',
        type: 'list',
      },
      {
        message: 'Enter route path (leave empty for root level):',
        name: 'routePath',
        type: 'input',
      },
    ],
  });
};
