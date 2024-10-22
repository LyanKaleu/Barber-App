import React, { useContext } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
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
import { GlobalContext } from "../../context/GlobalProvider";
import { getBarbers } from '../../lib/actions/user.actions';
import { Alert } from 'react-native';
import { Barber } from '../../@types';

const Dashboard: React.FC = () => {
    const { loading, user } = useContext(GlobalContext);
    
    const navigation = useNavigation<NavigationProp<AppStackParams>>();

    const [fetching, setFetching] = React.useState(false);
    const [barbers, setBarbers] = React.useState<Barber[]>([]);
    
    const getProviders = React.useCallback(async () => {
        try {
            setFetching(true);
           
            const barberList = await getBarbers(); // Chama a função que busca os barbeiros

            // Mapeia os documentos para o tipo Barber antes de chamar setBarbers
            const mappedBarbers: Barber[] = barberList.map((doc) => ({
                accountId: doc.accountId,
                username: doc.username,
                email: doc.email,
                phone: doc.phone,
                role: doc.role,
                avatar_url: doc.avatar,
            }));

            setBarbers(mappedBarbers); 
        } catch {
            Alert.alert('Erro ao buscar lista de provedores');
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
                        source={{ uri: user?.avatar_url || undefined }}
                        nome={user?.username || "Usuário"}
                    />
                </ProfileButton>
            </Header>
            <ProvidersList
                data={barbers}
                keyExtractor={provider => provider.accountId}
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
                            handleSelectProvider(provider.accountId);
                        }}>
                        <ProviderAvatar
                            size={72}
                            nome={provider?.username}
                            source={{ uri: provider?.avatar_url || undefined }}
                        />

                        <ProviderInfo>
                            <ProviderName>{provider?.username}</ProviderName>
                            <ProviderMeta>
                                <FeatherIcon name="calendar" size={14} color="#ff9000" />
                                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
                            </ProviderMeta>
                            <ProviderMeta>
                                <FeatherIcon name="clock" size={14} color="#ff9000" />
                                <ProviderMetaText>8h às 18h</ProviderMetaText>
                            </ProviderMeta>
                        </ProviderInfo>
                    </ProviderContainer>
                )}
            />
        </Container>
    );
};

export default Dashboard;