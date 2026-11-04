import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { VetTabParamList } from '../interfaces/navigation';
import { VetPacientesStackNavigator } from './VetPacientesStackNavigator';
import { PerfilStackNavigator } from './PerfilStackNavigator';
import { useSessionGuard } from '../hooks/useProfile';
import { useTheme } from '../theme/ThemeProvider';
import { typography } from '../theme/typography';

const Tab = createBottomTabNavigator<VetTabParamList>();

const icons: Record<keyof VetTabParamList, keyof typeof Ionicons.glyphMap> = {
  Pacientes: 'paw',
  Perfil: 'person',
};

export function VetTabNavigator() {
  const { palette } = useTheme();

  useSessionGuard();

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
      <Tab.Screen name="Pacientes" component={VetPacientesStackNavigator} options={{ title: 'PACIENTES' }} />
      <Tab.Screen name="Perfil" component={PerfilStackNavigator} options={{ title: 'PERFIL' }} />
    </Tab.Navigator>
  );
}
