import type { FC } from 'react';
// import styles from './styles.module.css';

interface ExampleComponentProps {
  // Define your props here
  example?: string;
}

const ExampleComponent: FC<ExampleComponentProps> = (props) => {
  // Destructure props
  const { example } = props;
  
  return (
    <div className="container">
      Example Component {example}
    </div>
  );
};

export default ExampleComponent;
