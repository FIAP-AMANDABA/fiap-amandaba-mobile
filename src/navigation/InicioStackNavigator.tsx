import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { InicioStackParamList } from '../interfaces/navigation';
import HomeScreen from '../screens/tutor/HomeScreen';
import LembretesScreen from '../screens/tutor/LembretesScreen';

const Stack = createNativeStackNavigator<InicioStackParamList>();

export function InicioStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Lembretes" component={LembretesScreen} />
    </Stack.Navigator>
  );
}
