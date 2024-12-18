import React from 'react';
import { BorderlessButtonProperties } from 'react-native-gesture-handler';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { Container } from './styles';

interface IconButtonProps extends BorderlessButtonProperties {
    name: string,
    size?: number,
    color?: string,
}

const IconButton: React.FC<IconButtonProps> = ({
    name,
    size = 20,
    color = '#999591',
    children,
    ...rest
}) => {
    return (
        <Container {...rest}>
            <FeatherIcon name={name} size={size} color={color} />
            {children}
        </Container>
    );
};

export default IconButton;