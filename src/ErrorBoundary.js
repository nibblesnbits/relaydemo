import React from 'react';
import Text from 'react-native';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    console.error('ErrorBoundary: getDerivedStateFromError', error);
    return {
      error,
    };
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;
    if (error) {
      return <Text>{error.message.toString()}</Text>;
    }
    return children;
  }
}
