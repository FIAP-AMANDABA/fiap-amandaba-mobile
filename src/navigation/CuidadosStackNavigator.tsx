import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CuidadosStackParamList } from '../interfaces/navigation';
import CuidadosPickerScreen from '../screens/tutor/cuidados/CuidadosPickerScreen';
import CuidadosPlanoScreen from '../screens/tutor/cuidados/CuidadosPlanoScreen';

const Stack = createNativeStackNavigator<CuidadosStackParamList>();

export function CuidadosStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CuidadosPicker" component={CuidadosPickerScreen} />
      <Stack.Screen name="CuidadosPlano" component={CuidadosPlanoScreen} />
    </Stack.Navigator>
  );
}
