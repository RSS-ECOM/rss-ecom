declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module './{{componentName}}';

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  import type React from 'react';

  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

// For Next.js environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_CTP_API_URL: string;
    NEXT_PUBLIC_CTP_AUTH_URL: string;
    NEXT_PUBLIC_CTP_CLIENT_ID: string;
    NEXT_PUBLIC_CTP_CLIENT_SECRET: string;
    NEXT_PUBLIC_CTP_PROJECT_KEY: string;
    NEXT_PUBLIC_CTP_REGION: string;
    NEXT_PUBLIC_CTP_SCOPES: string;
    NEXT_PUBLIC_DEFAULT_SEGMENT: string;
    NEXT_PUBLIC_NEXT_SEGMENT: string;
    NEXT_PUBLIC_PATH_SEGMENTS_TO_KEEP: string;
    NEXT_PUBLIC_PROJECT_TITLE: string;
    NEXT_PUBLIC_SEARCH_SEGMENT: string;
  }
}
