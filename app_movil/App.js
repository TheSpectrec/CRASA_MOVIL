import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabBar } from './src/components/TabBar';

// Screens
import Login from './src/screens/Login';
import Profile from './src/screens/Profile';
import Notifications from './src/screens/seller/Notifications';
import Sales from './src/screens/seller/Sales';
import Targets from './src/screens/seller/Targets';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen name="alertas" component={Notifications} />
      <Tab.Screen name="ventas" component={Sales} />
      <Tab.Screen name="cuotas" component={Targets} />
      <Tab.Screen name="perfil" component={Profile} />
    </Tab.Navigator>
  );
}

// App Root
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
