import styled from 'styled-components/native';
import { Dimensions, FlatList } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import {
    Provider,
    HourTextProps,
    HourProps,
    ProviderNameProps,
    ProviderContainerProps,
    WeekLetterProps,
    DateItemProps,
    CalendarIconProps,
} from './types';

import MyScreen from '../../components/Screen';
import MyText from '../../components/Text';
import MyButtonContainer from '../../components/ButtonContainer';
import MyAvatar from '../../components/Avatar';
import MyButton from '../../components/Button';
import MyIconButton from '../../components/IconButton';
import { Barber } from '../../@types';

const { width: screenWidth } = Dimensions.get('window');

const marginBetweenitems = 10;
const calendarContentPadding = 8;
const calendarContainerMargin = 16;
const itemSize =
    (screenWidth -
        2 * calendarContainerMargin -
        2 * calendarContentPadding -
        6 * marginBetweenitems) /
    7;

export const Container = styled(MyScreen)`
    flex: 1;
    background: ${props => props.theme.colors.background};
`;

export const Header = styled.View`
    padding: 24px;
    background: ${props => props.theme.colors.primary};

    flex-direction: row;
    align-items: center;
`;

export const BackButton = styled.TouchableOpacity`
    padding: 16px 16px 16px 24px;
    margin-left: -24px;
`;

export const HeaderTitle = styled(MyText)`
    color: ${props => props.theme.colors.text};
    font-size: 20px;
    line-height: 28px;
`;

export const UserAvatar = styled(MyAvatar)`
    margin-left: auto;
`;

export const ProvidersListContainer = styled.View`
    height: 112px;
    background-color: ${props => props.theme.colors.background};
`;

export const ProvidersList = styled(FlatList<Barber>).attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: {
        paddingVertical: 32,
        paddingHorizontal: 24,
    },
})``;

export const ProviderContainer = styled(
    MyButtonContainer,
)<ProviderContainerProps>`
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    margin-right: 16px;

    background: ${props => (props.selected ? props.theme.colors.secundary : props.theme.colors.li)};
    border-radius: 10px;
`;

export const ProviderAvatar = styled(MyAvatar)``;

export const ProviderName = styled(MyText)<ProviderNameProps>`
    font-size: 16px;
    margin-left: 8px;
    color: ${props => (props.selected ? props.theme.colors.primary : props.theme.colors.text)};
`;

export const Calendar = styled.View``;

export const Title = styled(MyText)`
    color: ${props => props.theme.colors.text};
    font-size: 24px;
    margin: 0 24px 24px;
`;

export const Schedule = styled.View`
    padding: 24px 0 16px;
`;

export const Section = styled.View`
    margin-bottom: 24px;
`;

export const SectionTitle = styled(MyText)`
    font-size: 18px;
    color: ${props => props.theme.colors.text};
    margin: 0 24px 12px;
`;

export const SectionContent = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: {
        paddingHorizontal: 24,
    },
})``;

export const Hour = styled(RectButton).attrs<HourProps>(props => ({
    enabled: props.available,
}))<HourProps>`
    padding: 12px;
    background: ${props => (props.selected ? props.theme.colors.secundary : props.theme.colors.li)};
    border-radius: 10px;
    margin-right: 8px;

    opacity: ${props => (props.available ? 1 : 0.3)};
`;

export const HourText = styled(MyText)<HourTextProps>`
    color: ${props => (props.selected ? props.theme.colors.primary : props.theme.colors.text)};
    font-size: 18px;
`;

export const CreateAppointmentButton = styled(MyButton)`
    margin: 0 24px 24px;
`;

export const CalendarContainer = styled.View`
    border-radius: 10px;
    background: ${props => props.theme.colors.primary};
    overflow: hidden;
    margin: 0 ${calendarContainerMargin}px;
`;

export const CalendarHeader = styled.View`
    flex-direction: row;
    background: ${props => props.theme.colors.background};
    align-items: center;
    justify-content: space-between;
    height: 50px;
`;

export const CalendarIconButton = styled(MyIconButton).attrs<CalendarIconProps>(
    props => ({
        color: props.highlight ? props.theme.colors.secundary : undefined,
    }),
)`
    align-self: stretch;
    padding: 0 16px;
`;

export const CalendarMonth = styled(MyText)`
    color: ${props => props.theme.colors.text};
`;

export const CalendarContent = styled.View`
    flex-direction: row;
    padding: ${calendarContentPadding}px;
    position: relative;
`;

export const CalendarColumn = styled.View`
    flex: 1;
    align-items: center;
`;

export const CalendarWeekLetter = styled(MyText)<WeekLetterProps>`
    color: ${props => (props.active ? props.theme.colors.secundary : props.theme.colors.text)};
    font-size: 16px;
    margin-bottom: 18px;
`;

export const CalendarDateItem = styled(MyButton).attrs<DateItemProps>(
    ({ disabled, active, theme }) => ({
        textProps: {
            style: { color: active ? theme.colors.primary : theme.colors.text, fontSize: 16 },
            bold: false,
        },
        enabled: !disabled,
    }),
)`
    width: ${itemSize}px;
    height: ${itemSize}px;
    padding: 0;
    margin-bottom: ${marginBetweenitems}px;
    background: ${({ disabled, active, theme }: DateItemProps) =>
        disabled ? 'transparent' : active ? theme.colors.secundary : theme.colors.li};
`;

export const EmptyCalendarItem = styled.View`
    width: ${itemSize}px;
    height: ${itemSize}px;
    margin-bottom: ${marginBetweenitems}px;
`;

export const LoadingCalendar = styled.ActivityIndicator.attrs({
    size: 50,
    color: '#ff9000',
})`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-17px);
`;