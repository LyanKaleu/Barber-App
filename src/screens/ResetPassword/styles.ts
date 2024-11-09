import styled from 'styled-components/native';

import MyText from '../../components/Text';
import MyInput from '../../components/Input';
import MyButton from '../../components/Button';
import MyTextButton from '../../components/TextButton';
import MyScreen from '../../components/Screen';

export const Screen = styled(MyScreen)`
    background: ${props => props.theme.colors.background};
`;

export const Scrollable = styled.ScrollView.attrs({
    showsVerticalScrollIndicator: false,
    contentContainerStyle: {
        flexGrow: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
})`
    background: ${props => props.theme.colors.background};
`;

export const Title = styled(MyText)`
    font-size: 24px;
    color: ${props => props.theme.colors.text};
    margin: 64px 0 24px;
`;

export const Input = styled(MyInput)`
    margin-bottom: 8px;
    background: ${props => props.theme.colors.li};
    color: ${props => props.theme.colors.inputColor};
`;

export const Button = styled(MyButton)`
    margin-top: 8px;
    align-self: stretch;
    background: ${props => props.theme.colors.secundary};
    color: ${props => props.theme.colors.secundary};
`;

export const Login = styled(MyTextButton)`
    margin-top: 24px;
    margin-bottom: 30px;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
`;