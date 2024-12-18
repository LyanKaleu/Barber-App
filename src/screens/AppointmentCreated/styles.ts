import styled from 'styled-components/native';

import MyButton from '../../components/Button';
import MyText from '../../components/Text';

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 0 24px;
    background: ${props => props.theme.colors.background};
`;

export const Title = styled(MyText)`
    font-size: 32px;
    color: ${props => props.theme.colors.text};
    margin-top: 48px;
    text-align: center;
`;

export const Description = styled(MyText)`
    font-size: 18px;
    color: ${props => props.theme.colors.inputPlaceholder};
    text-align: center;
    margin-top: 16px;
`;

export const OkButton = styled(MyButton)`
    margin-top: 56px;
    width: 200px;
    background: ${props => props.theme.colors.secundary};
    color: ${props => props.theme.colors.text};
`;