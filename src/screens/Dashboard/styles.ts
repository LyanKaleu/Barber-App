import styled from 'styled-components/native';
import { FlatList } from 'react-native';

import MyScreen from '../../components/Screen';
import MyText from '../../components/Text';
import MyButtonContainer from '../../components/ButtonContainer';
import MyAvatar from '../../components/Avatar';
import { Barber } from '../../@types';

export const Container = styled(MyScreen)`
    flex: 1;
    background: ${props => props.theme.colors.background};
`;

export const Header = styled.View`
    padding: 24px;
    background: ${props => props.theme.colors.primary};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const HeaderTitle = styled(MyText)`
    color: ${props => props.theme.colors.text};
    font-size: 20px;
    line-height: 28px;
`;

export const UserName = styled(MyText)`
    color: ${props => props.theme.colors.secundary};
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled(MyAvatar)``;

export const ProvidersList = styled(FlatList<Barber>).attrs({
    contentContainerStyle: {
        paddingTop: 32,
        paddingBottom: 16,
        paddingHorizontal: 24,
    },
})``;

export const ProvidersListTitle = styled(MyText)`
    color: ${props => props.theme.colors.text};
    font-size: 24px;
    margin-bottom: 24px;
`;

export const ProviderContainer = styled(MyButtonContainer)`
    background: ${props => props.theme.colors.li};
    margin-bottom: 16px;
`;

export const ProviderAvatar = styled(MyAvatar)``;

export const ProviderInfo = styled.View`
    flex: 1;
    margin-left: 20px;
`;

export const ProviderName = styled(MyText)`
    font-size: 18px;
    color: ${props => props.theme.colors.text};
`;

export const ProviderMeta = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: 8px;
`;

export const ProviderMetaText = styled(MyText)`
    margin-left: 8px;
    color: #999591;
`;

export const EmptyMessage = styled(MyText)`
    color: ${props => props.theme.colors.text};
    font-size: 16px;
    text-align: center;
    opacity: 0.5;
    line-height: 24px;
    margin-top: 8px;
`;