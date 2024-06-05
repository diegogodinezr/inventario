import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

type Props = {
  title: string;
};

const RoundButton = ({title}: Props): React.JSX.Element => (
  <TouchableOpacity>
    <Text>{title}</Text>
  </TouchableOpacity>
);


export default RoundButton;