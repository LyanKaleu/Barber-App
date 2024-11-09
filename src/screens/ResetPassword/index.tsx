import * as React from 'react';
import { TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { object, string, ref } from 'yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from 'styled-components';

import getValidationErrors from '../../utils/getValidationErrors';
import alert from '../../utils/alert';
import { AuthStackParams } from '../../routes/auth.routes';
import { appwriteConfig, account } from '../../lib/appwrite.config';

import { Screen, Scrollable, Title, Input, Button } from './styles';

const resetPasswordSchema = object().shape({
    password: string().required('Digite a nova senha').min(6, 'No mínimo 6 dígitos'),
    password_confirmation: string()
        .oneOf([ref('password'), null], 'Confirmação incorreta')
        .required('Confirme a nova senha'),
});

interface ResetPasswordFormData {
    password: string;
    password_confirmation: string;
}

const ResetPassword: React.FC = () => {
    const theme = useTheme();
    const route = useRoute<RouteProp<AuthStackParams, 'ResetPassword'>>();
    const navigation = useNavigation<StackNavigationProp<AuthStackParams, 'ResetPassword'>>();

    const [sending, setSending] = React.useState(false);

    const formRef = React.useRef<FormHandles>(null);

    const handleResetPasswordSubmit = React.useCallback(
        async (data: ResetPasswordFormData) => {
            setSending(true);
            formRef.current?.setErrors({});

            try {
                await resetPasswordSchema.validate(data, { abortEarly: false });
            } catch (error: any) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
                setSending(false);
                return;
            }

            try {
                const { userId, secret } = route.params;
                await account.updateRecovery(userId, secret, data.password, data.password_confirmation);
                alert({
                    title: 'Senha redefinida com sucesso',
                    message: 'Sua senha foi redefinida com sucesso. Você será redirecionado para a tela de login.',
                    buttons: [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
                });
            } catch (error: any) {
                alert({
                    title: 'Erro ao redefinir senha',
                    message: 'Ocorreu um erro ao redefinir sua senha. Tente novamente.',
                });
            }
            setSending(false);
        },
        [navigation, route.params],
    );

    return (
        <Screen safeTop>
            <Scrollable keyboardShouldPersistTaps="handled">
                <Title bold>Redefinir senha</Title>

                <Form ref={formRef} onSubmit={handleResetPasswordSubmit}>
                    <Input
                        name="password"
                        icon="lock"
                        placeholder="Nova senha"
                        secureTextEntry
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            formRef.current?.getFieldRef('password_confirmation').focus();
                        }}
                    />
                    <Input
                        name="password_confirmation"
                        icon="lock"
                        placeholder="Confirme a nova senha"
                        secureTextEntry
                        returnKeyType="send"
                        onSubmitEditing={() => {
                            formRef.current?.submitForm();
                        }}
                    />
                    <Button
                        loading={sending}
                        onPress={() => {
                            formRef.current?.submitForm();
                        }}>
                        Confirmar
                    </Button>
                </Form>
            </Scrollable>
        </Screen>
    );
};

export default ResetPassword;