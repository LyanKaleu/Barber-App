import React, { useContext } from 'react';
import { View, TextInput, ActivityIndicator, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import FeatherIcon from 'react-native-vector-icons/Feather';
import * as Yup from 'yup';
import { useActionSheet } from '@expo/react-native-action-sheet';
import getValidationErrors from '../../utils/getValidationErrors';

import alert from '../../utils/alert';

import {
    Container,
    Avatar,
    Input,
    Button,
    AvatarContainer,
    AvatarIconContainer,
} from './styles';
import { ImageDTO } from './types';
import { GlobalContext } from '../../context/GlobalProvider';
import { UpdateProfileParams, User } from '../../@types';
import { updateUserProfile } from '../../lib/actions/user.actions';

const Profile: React.FC = () => {
    const { user } = useContext(GlobalContext);
    const { showActionSheetWithOptions } = useActionSheet();
    
    const { setIsLogged, setUser } = React.useContext(GlobalContext);
    const [updatingAvatar, setUpdatingAvatar] = React.useState(false);
    const [updatingProfile, setUpdatingProfile] = React.useState(false);

    const formRef = React.useRef<FormHandles>(null);
    const emailInputRef = React.useRef<TextInput>(null);
    const passwordInputRef = React.useRef<TextInput>(null);
    const newPasswordInputRef = React.useRef<TextInput>(null);

    const handleSaveProfile = React.useCallback(async (data: UpdateProfileParams) => {
        try {
            setUpdatingProfile(true);
            formRef.current?.setErrors({});
    
            // Definir o esquema de validação
            const schema = Yup.object().shape({
                username: Yup.string().optional(),
                email: Yup.string().email("Email inválido").optional(),
                phone: Yup.string().optional(),
                password: Yup.string().required("A senha é obrigatória"),
            });
    
            // Validar os dados com o Yup
            await schema.validate(data, {
                abortEarly: false,
            });
    
            // Inicializar apenas com a senha, que é obrigatória
            const updateData: UpdateProfileParams = { password: data.password };
    
            // Adicionar propriedades a updateData somente se elas existirem e forem diferentes
            if (data.username && data.username !== user?.username) {
                updateData.username = data.username;
            }
            if (data.email && data.email !== user?.email) {
                updateData.email = data.email;
            }
            if (data.phone && data.phone !== user?.phone) {
                updateData.phone = data.phone;
            }
    
            // Chamar função de atualização do perfil
            const result = await updateUserProfile(updateData);
            
            if (result) {
                const mappedUser: User = {
                    accountId: result.$id,
                    email: result.email,
                    username: result.username,
                    phone: result.phone,
                    avatar_url: result?.avatar
                };

                setUser(mappedUser);
                
            } else {
                setUser(null);
            }
            setIsLogged(true);
    
            Alert.alert("Perfil atualizado com sucesso!");
        } catch (error: any) {
            if (error instanceof Yup.ValidationError) {
                const errors = getValidationErrors(error);
                formRef.current?.setErrors(errors);
                return;
            }
            
            Alert.alert(error.message || "Erro ao atualizar perfil.");
        } finally {
            setUpdatingProfile(false);
        }
    }, [user]); 

    const uploadAvatar = React.useCallback(
        async (image: ImageDTO) => {
            try {
                setUpdatingAvatar(true);

                const formData = new FormData();

                const imageResponse = await fetch(image.uri);
                const blob = await imageResponse.blob();

                const filePaths = image.uri.split('/');
                const filename = filePaths[filePaths.length - 1];

                formData.append('avatar', blob, filename);


            } catch (error: any) {
                alert({
                    title: 'Erro',
                    message: 'Houve um erro ao atualizar a foto, tente novamente',
                });
            } finally {
                setUpdatingAvatar(false);
            }
        },
        [],
    );

    const handleOpenPicker = async (selectType: 'image' | 'video') => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: selectType === 'image'
                    ? ['image/png', 'image/jpg', 'image/jpeg']
                    : ['video/mp4', 'video/gif']
            });

            if (result.type !== 'cancel') {
                const { uri, mimeType, name } = result;
                await uploadAvatar({
                    uri,
                    type: mimeType || 'image/jpeg',
                    name: name || uri.split('/').pop() || 'image.jpg',
                });
            }
        } catch (error) {
            alert({
                title: 'Erro',
                message: 'Houve um erro ao selecionar a imagem, tente novamente',
            });
        }
    };

    const handleRemoveAvatar = React.useCallback(async () => {
        try {
            setUpdatingAvatar(true);

        } catch (error) {
            alert({
                title: 'Erro',
                message: 'Houve um erro ao remover a foto, tente novamente',
            });
        } finally {
            setUpdatingAvatar(false);
        }
    }, [user]);

    function handleShowActionSheet() {
        const options = [
            { label: 'Abrir galeria', action: () => handleOpenPicker('image') },
            { label: 'Cancelar', action: () => undefined },
        ];
        const possuiFoto = !!user?.avatar_url;
        if (possuiFoto) {
            options.unshift({ label: 'Remover foto', action: handleRemoveAvatar });
        }

        showActionSheetWithOptions(
            {
                options: options.map(option => option.label),
                cancelButtonIndex: options.length - 1,
                destructiveButtonIndex: possuiFoto ? 0 : undefined,
            },
            selectedIndex => {
                if (typeof selectedIndex !== 'number') return;

                const selectedOption = options[selectedIndex];
                if (selectedOption?.action) {
                    selectedOption.action();
                }
            },
        );
    }

    return (
        <Container scroll>
            <AvatarContainer onPress={handleShowActionSheet}>
                <Avatar
                    size={186}
                    nome={user?.username}
                    source={{ uri: user?.avatar_url || undefined }}
                />
                <AvatarIconContainer>
                    {updatingAvatar ? (
                        <ActivityIndicator size={20} color="#312E38" />
                    ) : (
                        <FeatherIcon name="camera" size={20} color="#312E38" />
                    )}
                </AvatarIconContainer>
            </AvatarContainer>

            <View>
                <Form initialData={user} ref={formRef} onSubmit={handleSaveProfile}>
                    <Input
                        autoCapitalize="words"
                        name="username"
                        icon="user"
                        placeholder="Nome"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                            emailInputRef.current?.focus();
                        }}
                    />

                    <Input
                        ref={emailInputRef}
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"
                        name="email"
                        icon="mail"
                        placeholder="E-mail"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                            passwordInputRef.current?.focus();
                        }}
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
                            passwordInputRef.current?.focus();
                        }}
                    />

                    <Input
                        style={{ marginTop: 16 }}
                        ref={passwordInputRef}
                        secureTextEntry
                        name="password"
                        icon="lock"
                        placeholder="Senha atual"
                        textContentType="newPassword"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                            newPasswordInputRef.current?.focus();
                        }}
                    />
                </Form>
            </View>

            <Button
                loading={updatingProfile}
                enabled={!updatingProfile}
                onPress={() => {
                    formRef.current?.submitForm();
                }}>
                Confirmar mudanças
            </Button>
        </Container>
    );
};

export default Profile;