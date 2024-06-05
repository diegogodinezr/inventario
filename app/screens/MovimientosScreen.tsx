import React, { useEffect, useState } from 'react';
import { Alert, Button, SafeAreaView, Text, TextInput, View } from 'react-native';
import { Product } from './model/Product';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import LocalDB from './persistance/localdb';

export type MovimientosScreenParams = {
  product: Product;
};

const MovimientosScreen = ({ isEntrada }: { isEntrada: boolean }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EntradasScreen' | 'SalidasScreen'>>();
  const [product, setProduct] = useState<Product>(undefined!);
  const [cantidad, setCantidad] = useState<number>(0);

  const handleButtonPress = async () => {
    if (isEntrada) {
      await agregarMovimiento(product, new Date(), cantidad);
      await updateStock(product, cantidad);
    } else {
      if (cantidad > product.currentStock) {
        Alert.alert('Cantidad excesiva', 'La cantidad de salida excede el stock actual');
        return;
      }
      await agregarMovimiento(product, new Date(), cantidad * -1);
      await updateStock(product, cantidad * -1);
    }
    navigation.goBack();
  };

  useEffect(() => {
    setProduct(route.params.product);
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>{product?.nombre}</Text>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Cantidad</Text>
        <TextInput
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 }}
          onChangeText={(t) => setCantidad(Number.parseInt(t, 10))}
          value={cantidad.toString()}
          keyboardType="numeric"
        />
      </View>
      <Button
        title={isEntrada ? 'Registrar entrada' : 'Registrar salida'}
        onPress={handleButtonPress}
        color="#4CAF50"
      />
    </SafeAreaView>
  );
};

export const EntradasScreen = () => <MovimientosScreen isEntrada={true} />;
export const SalidasScreen = () => <MovimientosScreen isEntrada={false} />;

async function agregarMovimiento(product: Product, fechaHora: Date, cantidad: number) {
  const db = await LocalDB.connect();
  await db.transaction(async (tx) => {
    await tx.executeSql(
      'INSERT INTO movimientos (id_producto, fecha_hora, cantidad) VALUES (?, ?, ?)',
      [product.id, fechaHora.toISOString(), cantidad],
      () => {},
      (error) => console.error(error)
    );
  });
}

async function updateStock(product: Product, cantidad: number) {
  const db = await LocalDB.connect();
  db.transaction(async (tx) => {
    tx.executeSql(
      'UPDATE productos SET currentStock = (currentStock + ?) WHERE id = ?',
      [cantidad, product.id],
      () => {},
      (error) => console.error(error)
    );
  });
}