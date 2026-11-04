import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { TutorTabParamList } from '../interfaces/navigation';
import { InicioStackNavigator } from './InicioStackNavigator';
import { PetsStackNavigator } from './PetsStackNavigator';
import { CuidadosStackNavigator } from './CuidadosStackNavigator';
import { PerfilStackNavigator } from './PerfilStackNavigator';
import { useSessionGuard } from '../hooks/useProfile';
import { useReminderSync } from '../hooks/useReminders';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';

const Tab = createBottomTabNavigator<TutorTabParamList>();

const icons: Record<keyof TutorTabParamList, keyof typeof Ionicons.glyphMap> = {
  Inicio: 'home',
  Pets: 'paw',
  Cuidados: 'heart',
  Perfil: 'person',
};

export function TutorTabNavigator() {
  const { palette } = useTheme();

  useSessionGuard();
  useReminderSync();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: palette.greenDark,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.border },
        tabBarLabelStyle: { ...typography.bodySmall, fontSize: 10 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size * 0.8} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={InicioStackNavigator} options={{ title: 'INÍCIO' }} />
      <Tab.Screen name="Pets" component={PetsStackNavigator} options={{ title: 'PETS' }} />
      <Tab.Screen name="Cuidados" component={CuidadosStackNavigator} options={{ title: 'CUIDADOS' }} />
      <Tab.Screen name="Perfil" component={PerfilStackNavigator} options={{ title: 'PERFIL' }} />
    </Tab.Navigator>
  );
}
