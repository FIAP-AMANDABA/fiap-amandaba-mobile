import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PetsStackParamList } from '../interfaces/navigation';
import PetsListScreen from '../screens/tutor/pets/PetsListScreen';
import PetFormScreen from '../screens/tutor/pets/PetFormScreen';
import PetDetailScreen from '../screens/tutor/pets/PetDetailScreen';

const Stack = createNativeStackNavigator<PetsStackParamList>();

export function PetsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PetsList" component={PetsListScreen} />
      <Stack.Screen name="PetForm" component={PetFormScreen} />
      <Stack.Screen name="PetDetail" component={PetDetailScreen} />
    </Stack.Navigator>
  );
}
