import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { TutorTabParamList } from '../interfaces/navigation';
import HomeScreen from '../screens/tutor/HomeScreen';
import { PetsStackNavigator } from './PetsStackNavigator';
import { CuidadosStackNavigator } from './CuidadosStackNavigator';
import PerfilScreen from '../screens/tutor/PerfilScreen';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const Tab = createBottomTabNavigator<TutorTabParamList>();

const icons: Record<keyof TutorTabParamList, keyof typeof Ionicons.glyphMap> = {
  Inicio: 'home',
  Pets: 'paw',
  Cuidados: 'heart',
  Perfil: 'person',
};

export function TutorTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.greenDark,
        tabBarInactiveTintColor: colors.gray,
        tabBarLabelStyle: { ...typography.bodySmall, fontSize: 10 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size * 0.8} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: 'INÍCIO' }} />
      <Tab.Screen name="Pets" component={PetsStackNavigator} options={{ title: 'PETS' }} />
      <Tab.Screen name="Cuidados" component={CuidadosStackNavigator} options={{ title: 'CUIDADOS' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: 'PERFIL' }} />
    </Tab.Navigator>
  );
}
