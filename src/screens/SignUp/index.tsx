import * as React from 'react';
import { Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { object, string } from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';

import getValidationErrors from '../../utils/getValidationErrors';
import alert from '../../utils/alert';
import { AuthStackParams } from '../../routes/auth.routes';
import { useAuth } from '../../hooks/auth';

import {
    Screen,
    Scrollable,
    Title,
    Input,
    Button,
    BackToLogin,
} from './styles';
import { useTheme } from 'styled-components/native';

const signUpSchema = object().shape({
    name: string().required('Nome obrigatório'),
    email: string()
        .required('E-mail obrigatório')
        .email('Digite um e-mail válido'),
    password: string().min(6, 'No mínimo 6 dígitos'),
});

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const theme = useTheme();

    const { signUp } = useAuth();
    const navigation = useNavigation<StackNavigationProp<AuthStackParams, 'SignUp'>>();

    const [fetching, setFetching] = React.useState(false);

    const emailRef = React.useRef<TextInput>(null);
    const passwordRef = React.useRef<TextInput>(null);
    const formRef = React.useRef<FormHandles>(null);

    const handleLogin = React.useCallback(
        (email?: string) => {
            navigation.navigate('Login', { email: email || '' });
        },
        [navigation],
    );

    const handleSignUpSubmit = React.useCallback(
        async (data: SignUpFormData) => {
            setFetching(true);
            formRef.current?.setErrors({});

            try {
                await signUpSchema.validate(data, { abortEarly: false });
            } catch (error: any) {
                const errors = getValidationErrors(error);

                setFetching(false);
                formRef.current?.setErrors(errors);
                return;
            }

            try {
                await signUp(data);

                alert({
                    title: 'Cadastro realizado com sucesso!',
                    message: 'Você já pode fazer login na aplicação',
                    buttons: [
                        {
                            text: 'Ok',
                            onPress: () => {
                                handleLogin(data.email);
                            },
                        },
                    ],
                });
            } catch {
                alert({
                    title: 'Erro ao realizar cadastro',
                    message: 'Não foi possível cadastrar o usuário, tente novamente',
                });
            }

            setFetching(false);
        },
        [handleLogin, signUp],
    );

    return (
        <Screen safeTop>
            <Scrollable keyboardShouldPersistTaps="handled">
                <Image source={theme.logo} />

                <Title bold>Crie sua conta</Title>

                <Form
                    onSubmit={handleSignUpSubmit}
                    ref={formRef}
                    style={{ marginHorizontal: 24 }}>
                        <Input 
                            name='name'
                            icon='user'
                            autoCapitalize='words'
                            placeholder='Nome'
                            blurOnSubmit={false}
                            returnKeyType='next'
                            onSubmitEditing={() => {
                                emailRef.current && emailRef.current.focus();
                            }}
                        />

                        <Input 
                            name='email'
                            icon='mail'
                            keyboardType='email-address'
                            autoCorrect={false}
                            autoCapitalize='none'
                            placeholder='E-mail'
                            blurOnSubmit={false}
                            returnKeyType='next'
                            onSubmitEditing={() => {
                                passwordRef.current && passwordRef.current.focus();
                            }}
                            ref={emailRef}
                        />

                        <Input
                            name='password'
                            icon='lock'
                            secureTextEntry
                            placeholder='Senha'
                            textContentType='newPassword'
                            onSubmitEditing={() => {
                                formRef?.current?.submitForm();
                            }}
                            returnKeyType='send'
                            ref={passwordRef}
                        />

                        <Button
                            loading={fetching}
                            onPress={() => {
                                formRef?.current?.submitForm();
                            }}>
                            Cadastrar
                        </Button>
                </Form>

                <BackToLogin icon='arrow-left' onPress={() => handleLogin()}>
                    Voltar para login
                </BackToLogin>
            </Scrollable>
        </Screen>
    );
};

export default SignUp;