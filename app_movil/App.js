import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabBar } from './src/components/TabBar';

// Providers
import { NotificationsProvider } from './src/contexts/NotificationsContext';
import { TabBarProvider } from './src/contexts/TabBarContext';

// Screens
import Login from './src/screens/Login';
import Profile from './src/screens/Profile';

// Seller screens
import Notifications from './src/screens/seller/Notifications';
import Sales from './src/screens/seller/Sales';
import Quotas from './src/screens/seller/Quotas';

// Supervisor screens
import SupNotifications from './src/screens/supervisor/Notifications';
import SupSales from './src/screens/supervisor/Sales';
import SellerQuotas from './src/screens/supervisor/SellerQuotas';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator
// Seller tab navigator
function SellerTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen name="alertas" component={Notifications} />
      <Tab.Screen name="ventas" component={Sales} />
      <Tab.Screen name="cuotas" component={Quotas} />
      <Tab.Screen name="perfil" component={Profile} />
    </Tab.Navigator>
  );
}

// App Root
// Supervisor tab navigator
function SupervisorTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="alertas" component={SupNotifications} />
      <Tab.Screen name="ventas" component={SupSales} />
      <Tab.Screen name="cuotas" component={SellerQuotas} />
      <Tab.Screen name="perfil" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NotificationsProvider>
      <TabBarProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" component={Login} />
            <Stack.Screen name="seller" component={SellerTabs} />
            <Stack.Screen name="supervisor" component={SupervisorTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </TabBarProvider>
    </NotificationsProvider>
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
