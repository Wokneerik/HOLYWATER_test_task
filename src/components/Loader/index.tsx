import React, {useEffect, useRef, useState} from 'react';
import {Animated, LayoutChangeEvent, View} from 'react-native';
import styles from './styles';

const Loader = ({progress = 0, duration = 2000}) => {
  const [width, setWidth] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (progress === 0) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(progress / 100);
    }
  }, [progress, duration]);

  const onLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    setWidth(width);
  };

  const fillWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={styles.background} />
      <Animated.View
        style={[
          styles.fill,
          {
            width: fillWidth,
          },
        ]}
      />
    </View>
  );
};

export default Loader;
