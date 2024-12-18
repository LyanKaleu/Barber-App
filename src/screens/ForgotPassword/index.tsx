import * as React from 'react';
import { Image, TextInput } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { object, string } from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from 'styled-components';


import getValidationErrors from '../../utils/getValidationErrors';
import alert from '../../utils/alert';
import { AuthStackParams } from '../../routes/auth.routes';

import { Screen, Scrollable, Title, Input, Button, Login } from './styles';
import { Account, Client } from 'react-native-appwrite';
import { appwriteConfig } from '../../lib/appwrite.config';

const forgotPasswordSchema = object().shape({
    email: string()
        .required('Digite o seu e-mail de login')
        .email('E-mail inválido'),
});

interface ForgotPasswordFormData {
    email: string;
}

const ForgotPassword: React.FC = () => {
    const theme = useTheme();
    const route = useRoute<RouteProp<AuthStackParams, 'ForgotPassword'>>();
    const navigation = useNavigation<StackNavigationProp<AuthStackParams, 'ForgotPassword'>>();

    const [sending, setFetching] = React.useState(false);

    const passwordRef = React.useRef<TextInput>(null);
    const formRef = React.useRef<FormHandles>(null);

    const handleLogin = React.useCallback(() => {
        navigation.navigate('Login', { email: undefined });
    }, [navigation]);

    const client = new Client(); 
    client 
        .setEndpoint(appwriteConfig.endpoint) 
        .setProject(appwriteConfig.projectId);

    const account = new Account(client);

    const handleForgotPasswordSubmit = React.useCallback(
        async (data: ForgotPasswordFormData) => {
            setFetching(true);
            formRef.current?.setErrors({});

            try {
                await forgotPasswordSchema.validate(data, { abortEarly: false });
            } catch (error: any) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
            }

            try {
                await account.createRecovery(data.email, "http://localhost:8081/reset-password");

                alert({
                    title: 'E-mail de recuperação enviado',
                    message: 'Confira a sua caixa de mensagem e siga as instruções para resetar a sua senha.\n\nCaso não encontre o e-mail, verifique a caixa de spam.',
                    buttons: [{ text: 'Voltar para o login', onPress: handleLogin }],
                });
            } catch {
                alert({
                    title: 'Erro ao recuperar senha',
                    message: 'Verifique o e-mail digitado',
                });
            }
            setFetching(false);
        },
        [handleLogin],
    );

    return (
        <Screen safeTop>
            <Scrollable keyboardShouldPersistTaps="handled">
                <Image source={theme.logo} />

                <Title bold>Recuperar senha</Title>

                <Form
                    onSubmit={handleForgotPasswordSubmit}
                    ref={formRef}
                    initialData={{ email: route.params.email }}
                >
                    <Input
                        name="email"
                        icon="mail"
                        placeholder="E-mail"
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            passwordRef.current && passwordRef.current.focus();
                        }}
                    />
                    <Button
                        loading={sending}
                        onPress={() => {
                            formRef.current?.submitForm();
                        }}>
                            Enviar
                    </Button>
                </Form>

                <Login onPress={handleLogin}>Fazer login</Login>
            </Scrollable>
        </Screen>
    );
};

export default ForgotPassword;