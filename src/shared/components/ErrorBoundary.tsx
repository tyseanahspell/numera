import React, { Component, type ReactNode } from 'react';
import { View, Text } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.navy900,
            alignItems: 'center',
            justifyContent: 'center',
            padding: SPACING.xl,
          }}
        >
          <Text style={{ color: COLORS.white, fontSize: 22, fontWeight: '700', marginBottom: 8 }}>
            Something went wrong
          </Text>
          <Text style={{ color: COLORS.textMuted, textAlign: 'center', marginBottom: 24 }}>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </Text>
          <Button title="Try Again" onPress={() => this.setState({ hasError: false, error: undefined })} />
        </View>
      );
    }

    return this.props.children;
  }
}
