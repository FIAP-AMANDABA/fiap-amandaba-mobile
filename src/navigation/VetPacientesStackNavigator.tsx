import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { PetsStackParamList } from '../interfaces/navigation';
import PacientesScreen from '../screens/vet/PacientesScreen';
import PetDetailScreen from '../screens/tutor/pets/PetDetailScreen';

// Reaproveita as rotas dos pets do tutor: "PetsList" é a lista de pacientes e o detalhe é a mesma tela.
const Stack = createNativeStackNavigator<PetsStackParamList>();

export function VetPacientesStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PetsList" component={PacientesScreen} />
      <Stack.Screen name="PetDetail" component={PetDetailScreen} />
    </Stack.Navigator>
  );
}
