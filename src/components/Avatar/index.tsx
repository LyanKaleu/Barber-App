import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';
import { AvatarProps } from './props';
import { AvatarContainer } from './styles';

const MyAvatar: React.FC<AvatarProps> = ({ size = 112, source, style, ...rest }) => {
    const isUriSource = (source: ImageSourcePropType | undefined): source is { uri: string } => {
        return typeof source === 'object' && source !== null && 'uri' in source;
    };

    return (
        <AvatarContainer size={size} style={style}>
            {isUriSource(source) && (
                <Image
                    style={{ height: size, width: size, borderRadius: size }}
                    source={source}
                    {...rest} // Passa as outras props do componente
                />
            )}
        </AvatarContainer>
    );
};

export default MyAvatar;
