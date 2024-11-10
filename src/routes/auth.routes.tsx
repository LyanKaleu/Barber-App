import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import ForgotPassword from '../screens/ForgotPassword';
import ResetPassword from '../screens/ResetPassword';

export type AuthStackParams = {
  Login: {
    email?: string;
  };
  SignUp: undefined;
  ForgotPassword: {
    email?: string;
  };
  ResetPassword: {
    userId: string;
    secret: string;
  };
};

const AuthStack = createStackNavigator<AuthStackParams>();

function AuthRoutes() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#312e38' },
      }}>
        <AuthStack.Screen name='Login' component={Login} />
        <AuthStack.Screen name='SignUp' component={SignUp} />
        <AuthStack.Screen name='ForgotPassword' component={ForgotPassword} />
        <AuthStack.Screen name='ResetPassword' component={ResetPassword} />
      </AuthStack.Navigator>
  );
}

export default AuthRoutes;