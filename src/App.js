import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './pages/StackNavigator';


export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator/>
    </NavigationContainer>
  );
};