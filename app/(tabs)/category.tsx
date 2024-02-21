import { StyleSheet, Text, View } from 'react-native';
import { SubCatCRUD } from '../Hello';



export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <SubCatCRUD />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
