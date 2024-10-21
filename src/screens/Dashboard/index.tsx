import * as React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { GlobalContext } from '../../context/GlobalProvider';
import alert from '../../utils/alert';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';
import { Provider } from './types';
import { AppStackParams } from '../../routes/app.routes';

import {
    Container,
    Header,
    HeaderTitle,
    ProviderAvatar,
    ProviderContainer,
    ProviderInfo,
    ProvidersList,
    ProvidersListTitle,
    UserName,
    ProfileButton,
    ProviderMeta,
    ProviderMetaText,
    ProviderName,
    UserAvatar,
    EmptyMessage,
} from './styles';

const Dashboard: React.FC = () => {
    const { user } = React.useContext(GlobalContext);

    const navigation = useNavigation<NavigationProp<AppStackParams>>();

    const [providers, setProviders] = React.useState<Provider[]>([]);
    const [fetching, setFetching] = React.useState(false);

    const getProviders = React.useCallback(async () => {
        try {
            setFetching(true);
            // const { data } = await api.getProviders();
            // Lista de provedores fictícios
            const data: Provider[] = [
                { 
                    id: '1', 
                    name: 'Barbeiro 1', 
                    email: 'barbeiro1@example.com',
                    avatar: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    avatar_url: 'https://example.com/avatar1.png',
                    service: 'Corte de cabelo',
                    price: 30.00, 
                },
                { 
                    id: '2', 
                    name: 'Barbeiro 2', 
                    email: 'barbeiro2@example.com',
                    avatar: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    avatar_url: 'https://example.com/avatar2.png' ,
                    service: 'Barba',
                    price: 20.00,
                },
                { 
                    id: '3', 
                    name: 'Barbeiro 3', 
                    email: 'barbeiro3@example.com',
                    avatar: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    avatar_url: 'https://example.com/avatar3.png',
                    service: 'Corte de cabelo e barba',
                    price: 45.00, 
                },
                { 
                    id: '4', 
                    name: 'Barbeiro 4', 
                    email: 'barbeiro4@example.com',
                    avatar: null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    avatar_url: 'https://example.com/avatar4.png',
                    service: 'Corte de cabelo',
                    price: 30.00, 
                },
            ];
            setProviders(data);
        } catch {
            alert({ title: 'Erro', message: 'Erro ao buscar lista de provedores' });
        } finally {
            setFetching(false);
        }
    }, []);

    React.useEffect(() => {
        getProviders();
    }, [getProviders]);

    const handleSelectProvider = React.useCallback(
        (providerId: string) => {
            navigation.navigate('AppointmentDatePicker', { providerId });
        },
        [navigation],
    );

    return (
        <Container safeTop statusBarProps={{ backgroundColor: '#28262e' }}>
            <Header>
                <HeaderTitle>
                    Bem vindo,
                    {'\n'}
                    <UserName bold>{user?.username}</UserName>
                </HeaderTitle>

                <ProfileButton onPress={() => navigation.navigate('Profile')}>
                    <UserAvatar
                        size={56}
                        source={{ uri: user.avatar_url || undefined }}
                        nome={user?.username}
                    />
                </ProfileButton>
            </Header>

            <ProvidersList
                data={providers}
                keyExtractor={provider => provider.id}
                onRefresh={getProviders}
                refreshing={fetching}
                ListHeaderComponent={
                    <ProvidersListTitle bold>Cabelereiros</ProvidersListTitle>
                }
                ListEmptyComponent={
                    !fetching ? (
                        <EmptyMessage onPress={getProviders}>
                            Nenhum prestador encontrado.
                            {'\n'}
                            Clique aqui para tentar novamente.
                        </EmptyMessage>
                    ) : undefined
                }
                renderItem={({ item: provider }) => (
                    <ProviderContainer
                        onPress={() => {
                            handleSelectProvider(provider.id);
                        }}>
                            <ProviderAvatar
                                size={72}
                                nome={provider.name}
                                source={{ uri: provider.avatar_url || undefined }}
                            />

                            <ProviderInfo>
                                <ProviderName>{provider.name}</ProviderName>
                                <ProviderMeta>
                                    <FeatherIcon name="calendar" size={14} color="#ff9000" />
                                    <ProviderMetaText>Segunda à sexta</ProviderMetaText>
                                </ProviderMeta>
                                <ProviderMeta>
                                    <FeatherIcon name="clock" size={14} color="#ff9000" />
                                    <ProviderMetaText>8h às 18h</ProviderMetaText>
                                </ProviderMeta>
                                <ProviderMeta>
                                    <FeatherIcon name="scissors" size={14} color="#ff9000" />
                                    <ProviderMetaText>{provider.service}</ProviderMetaText>
                                </ProviderMeta>
                                <ProviderMeta>
                                    <FeatherIcon name="dollar-sign" size={14} color="#ff9000" />
                                    <ProviderMetaText>R$ {provider.price.toFixed(2)}</ProviderMetaText>
                                </ProviderMeta>
                            </ProviderInfo>
                        </ProviderContainer>
                )}
            />
        </Container>
    );
};

export default Dashboard;