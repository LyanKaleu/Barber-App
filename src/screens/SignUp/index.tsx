import * as React from 'react';
import { Alert, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as yup from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';

import getValidationErrors from '../../utils/getValidationErrors';
import alert from '../../utils/alert';
import { AuthStackParams } from '../../routes/auth.routes';
import {
    Screen,
    Scrollable,
    Title,
    Input,
    Button,
    BackToLogin,
} from './styles';
import { useTheme } from 'styled-components/native';
import { createUser } from '../../lib/actions/user.actions';
import { GlobalContext } from '../../context/GlobalProvider';
import { User } from '../../@types';

const phoneRegExp = /^(1|[2-9][0-9])\d{9,14}$/;

const signUpSchema = yup.object().shape({
    name: yup.string().required('Nome obrigatório'),
  email: yup
    .string()
    .required('E-mail obrigatório')
    .email('Digite um e-mail válido'),
  password: yup
    .string()
    .min(6, 'No mínimo 6 dígitos')
    .required('Senha obrigatória'),
  phone: yup
    .string()
    .required('Número de telefone obrigatório')
    .matches(phoneRegExp, 'Número de telefone inválido. Formato esperado: (86)99490-5662')
});

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
    phone: string;
}

const SignUp: React.FC = () => {
    const theme = useTheme();
    const { setUser, setIsLogged } = React.useContext(GlobalContext);
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
                const user = {
                    email: data.email,
                    password: data.password,
                    username: data.name,
                    phone: '+'+data.phone
                };

                const result = await createUser(user);

                const mappedUser: User = {
                    id: result.$id,
                    email: result.email,
                    username: result.username,
                    phone: result.phone,
                    avatar_url: result.avatar_url
                };

                setUser(mappedUser);
                setIsLogged(true);
            } catch (error: any) {
                Alert.alert("Error", error.message);
            }

            setFetching(false);
        },
        [handleLogin],
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
                        name="phone"
                        icon="phone" 
                        keyboardType="phone-pad"
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="Telefone (ex: 86994516203)" 
                        blurOnSubmit={false}
                        returnKeyType="next"
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

                <BackToLogin icon='arrow-left' iconProps={{color: theme.colors.secundary}} onPress={() => handleLogin()}>
                    Voltar para login
                </BackToLogin>
            </Scrollable>
        </Screen>
    );
};

export default SignUp;