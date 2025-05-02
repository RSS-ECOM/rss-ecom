'use client';

import type { FC } from 'react';
import styles from './{{stylesName}}';

interface {{componentName}}Props {
  // Define your props here
}

const {{componentName}}: FC<{{componentName}}Props> = (props) => {
  // Destructure props
  const {} = props;
  
  return (
    <div className={styles.container}>
      {{componentName}} Component
    </div>
  );
};

export default {{componentName}};
