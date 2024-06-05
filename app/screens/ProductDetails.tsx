import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { Product } from './model/Product';

export type Params = {
  product: Product;
};

export type Props = {
  route: RouteProp<RootStackParamList, 'ProductDetails'>;
  navigation: StackNavigationProp<RootStackParamList, 'ProductDetails'>;
};

function ProductDetails({ route, navigation }: Props): React.JSX.Element {
  const [product, setProduct] = useState<Product>(undefined!);
  useEffect(() => {
    setProduct(route.params.product);
  }, [route]);

  return (
    <SafeAreaView style={styles.container}>
      {product && (
        <View>
          <Text style={styles.title}>{product.nombre}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Existencias:</Text>
            <Text
              style={[
                styles.value,
                product.currentStock < product.minStock && styles.stockError,
              ]}
            >
              {product.currentStock} / {product.maxStock}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Precio:</Text>
            <Text style={styles.value}>$ {product.precio.toFixed(2)}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Entrada"
              onPress={() => navigation.push('EntradasScreen', { product })}
              color="#4CAF50"
            />
            <Button
              title="Salida"
              onPress={() => navigation.push('SalidasScreen', { product })}
              color="#F44336"
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#666666',
    marginRight: 8,
  },
  value: {
    fontSize: 16,
    color: '#333333',
  },
  stockError: {
    color: '#F44336',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
});

export default ProductDetails;