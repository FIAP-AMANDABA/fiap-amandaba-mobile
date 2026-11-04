import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PerfilStackParamList } from '../interfaces/navigation';
import PerfilScreen from '../screens/tutor/perfil/PerfilScreen';
import EditarPerfilScreen from '../screens/tutor/perfil/EditarPerfilScreen';
import AlterarSenhaScreen from '../screens/tutor/perfil/AlterarSenhaScreen';
import SobreScreen from '../screens/tutor/perfil/SobreScreen';

const Stack = createNativeStackNavigator<PerfilStackParamList>();

export function PerfilStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PerfilHome" component={PerfilScreen} />
      <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
      <Stack.Screen name="AlterarSenha" component={AlterarSenhaScreen} />
      <Stack.Screen name="Sobre" component={SobreScreen} />
    </Stack.Navigator>
  );
}
