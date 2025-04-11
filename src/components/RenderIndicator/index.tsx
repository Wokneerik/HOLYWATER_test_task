import React, {FC} from 'react';
import {View} from 'react-native';
import {Slide} from '../../types';
import styles from './styles';

interface RenderIndicatorProps {
  slides: Slide[];
  currentIndex: number;
}

const RenderIndicator: FC<RenderIndicatorProps> = ({slides, currentIndex}) => {
  return (
    <View style={styles.indicatorContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.indicatorDot,
            index === currentIndex && styles.indicatorDotActive,
          ]}
        />
      ))}
    </View>
  );
};

export default RenderIndicator;
