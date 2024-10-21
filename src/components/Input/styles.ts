import styled, { css } from 'styled-components/native';
import RNIcon from 'react-native-vector-icons/Feather';
import { TextInput as RNTextInput } from 'react-native';
import React from 'react';

interface ContainerProps {
    isFocused?: boolean,
    error?: boolean,
};

export const Container = styled.View<ContainerProps>`
    width: 100%;
    height: 60px;
    padding: 0 16px;
    background: ${props => props.theme.colors.li};
    border-radius: 10px;
    flex-direction: row;
    align-items: center;
    border-width: 2px;
    border-color: ${props => props.theme.colors.li};

    ${({ error }) =>
        error &&
        css`
            border-color: #c53030;
        `
    }

    ${({ isFocused }) =>
        isFocused &&
        css`
            border-color: #ff9000;
        `
    }
`;

export const TextInput = styled(RNTextInput).attrs(props => ({
    placeholderTextColor: '#666360',
}))`
    flex: 1;
    color: ${props => props.theme.colors.inputColor};
    font-size: 16px;
    font-family: 'RobotoSlab-Regular';
`;

export const Icon = styled(RNIcon)`
    margin-right: 10px;
`;

export const ErrorText = styled.Text`
    color: #c53030;
    font-size: 14px;
    margin: 4px 0 0 16px;
`;