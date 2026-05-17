import { Text, TextProps } from 'react-native';

export default function AppText({ style, ...props }: TextProps) {
  return <Text style={[{ fontFamily: 'NerdFont' }, style]} {...props} />;
}
