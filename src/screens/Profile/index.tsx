import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { View, TextInput, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import FeatherIcon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import { useActionSheet } from '@expo/react-native-action-sheet';
import getValidationErrors from '../../utils/getValidationErrors';

import {
    Container,
    Avatar,
    Input,
    Button,
    AvatarContainer,
    AvatarIconContainer,
} from './styles';
import { GlobalContext } from '../../context/GlobalProvider';
import { UpdateProfileParams, User } from '../../@types';
import { createVideoPost, updateUserProfile } from '../../lib/actions/user.actions';
import { useNavigation } from '@react-navigation/native';

const Profile: React.FC = () => {
    const navigation = useNavigation();
    const { user, setIsLogged, setUser } = useContext(GlobalContext);
    const { showActionSheetWithOptions } = useActionSheet();

    const [updatingAvatar, setUpdatingAvatar] = useState(false);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);

    const formRef = useRef<FormHandles>(null);
    const emailInputRef = useRef<TextInput>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const newPasswordInputRef = useRef<TextInput>(null);

    type Thumbnail = { uri: string }; // Define um tipo específico para o thumbnail

    const [form, setForm] = useState<{
        title: string;
        video: any; // ajuste conforme necessário
        thumbnail: Thumbnail | null; // thumbnail pode ser nulo ou do tipo Thumbnail
        prompt: string;
    }>({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
    });

    // Atualiza a flag do formulário sujo
    useEffect(() => {
        const isDirty = form.title || form.video || form.thumbnail || form.prompt;
        setIsFormDirty(!!isDirty);
    }, [form]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!isFormDirty || uploading) return;

            e.preventDefault();
            Alert.alert(
                'Descartar mudanças?',
                'Você tem mudanças não salvas. Deseja sair sem confirmar?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Sair',
                        style: 'destructive',
                        onPress: () => navigation.dispatch(e.data.action),
                    },
                ]
            );
        });

        return unsubscribe;
    }, [navigation, isFormDirty, uploading]);

    const handleSaveProfile = useCallback(async (data: UpdateProfileParams) => {
        try {
            if (form.thumbnail) {
                try {
                    setUploading(true);
                    await createVideoPost({ ...form, userId: user?.accountId });
                    Alert.alert("Sucesso", "Avatar enviado com sucesso");

                    setForm({ title: "", video: null, thumbnail: null, prompt: "" });

                    setUser((prevUser) => {
                        if (!prevUser) {
                            return null; // Garantir consistência com o tipo esperado quando prevUser é null
                        }

                        return {
                            ...prevUser,
                            avatar_url: form.thumbnail?.uri ?? prevUser.avatar_url,
                        };
                    });
                    setUploading(false);
                } catch (error: any) {
                    Alert.alert(error.message || "Erro ao atualizar avatar.");
                }
            }

            // Verificar se houve alterações nos campos do perfil
            const hasChanges =
                data.username !== user?.username ||
                data.email !== user?.email ||
                data.phone !== user?.phone;

            if (hasChanges) {
                setUpdatingProfile(true);
                formRef.current?.setErrors({});

                const schema = Yup.object().shape({
                    username: Yup.string(),
                    email: Yup.string().email("Email inválido"),
                    phone: Yup.string(),
                    password: Yup.string().required("A senha é obrigatória"),
                });

                await schema.validate(data, { abortEarly: false });

                const updateData: UpdateProfileParams = { password: data.password };

                if (data.username && data.username !== user?.username) {
                    updateData.username = data.username;
                }
                if (data.email && data.email !== user?.email) {
                    updateData.email = data.email;
                }
                if (data.phone && data.phone !== user?.phone) {
                    updateData.phone = data.phone;
                }

                const result = await updateUserProfile(updateData);

                if (result) {
                    setUser((prevUser) => ({
                        ...prevUser,
                        accountId: result.accountId ?? prevUser?.accountId,
                        email: result.email ?? prevUser?.email,
                        username: result.username ?? prevUser?.username,
                        phone: result.phone ?? prevUser?.phone,
                        avatar_url: form.thumbnail?.uri || prevUser?.avatar_url, // Mantém avatar existente se não houver thumbnail
                    }));
                }

                setIsLogged(true);
                Alert.alert("Perfil atualizado com sucesso!");
            } 
        } catch (error: any) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
                return;
            }

            Alert.alert(error.message || "Erro ao atualizar o perfil.");
        } finally {
            setUpdatingProfile(false);
        }
    }, [form, user, setUser, setIsLogged]);

    const openPicker = async (selectType: 'image' | 'video') => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: selectType === 'image'
                    ? ['image/png', 'image/jpg', 'image/jpeg']
                    : ['video/mp4', 'video/gif'],
            });

            if (!result.canceled && selectType === "image") {
                setForm((prev) => ({ ...prev, thumbnail: result.assets[0] }));
            }
        } catch {
            Alert.alert("Erro", "Falha ao selecionar o arquivo");
        }
    };

    return (
        <Container scroll>
            <AvatarContainer onPress={() => openPicker("image")}>
                <Avatar
                    size={186}
                    nome={user?.username ?? ''}
                    source={form.thumbnail?.uri ? { uri: form.thumbnail.uri } : { uri: user?.avatar_url }}
                />
                <AvatarIconContainer>
                    {uploading ? (
                        <ActivityIndicator size={20} color="#312E38" />
                    ) : (
                        <FeatherIcon name="camera" size={20} color="#312E38" />
                    )}
                </AvatarIconContainer>
            </AvatarContainer>

            <View>
                <Form initialData={user || undefined} ref={formRef} onSubmit={handleSaveProfile}>
                    <Input
                        autoCapitalize="words"
                        name="username"
                        icon="user"
                        placeholder="Nome"
                        returnKeyType="next"
                        onSubmitEditing={() => emailInputRef.current?.focus()}
                    />
                    <Input
                        ref={emailInputRef}
                        keyboardType="email-address"
                        name="email"
                        icon="mail"
                        placeholder="E-mail"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordInputRef.current?.focus()}
                    />
                    <Input
                        name="phone"
                        icon="phone"
                        keyboardType="phone-pad"
                        placeholder="Telefone"
                        onSubmitEditing={() => passwordInputRef.current?.focus()}
                    />
                    <Input
                        ref={passwordInputRef}
                        secureTextEntry
                        name="password"
                        icon="lock"
                        placeholder="Senha atual"
                        returnKeyType="next"
                        onSubmitEditing={() => newPasswordInputRef.current?.focus()}
                    />
                </Form>
            </View>

            <Button
                loading={updatingProfile}
                enabled={!updatingProfile}
                onPress={() => formRef.current?.submitForm()}
            >
                Confirmar mudanças
            </Button>
        </Container>
    );
};

export default Profile;
