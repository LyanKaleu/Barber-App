import React, {
    useEffect,
    useCallback,
    useRef,
    useImperativeHandle,
    useState,
    forwardRef
} from 'react';
import { TextInputProps, TextInput as RNTextInput } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput , Icon, ErrorText } from './styles';

interface InputProps extends TextInputProps {
    name: string,
    icon?: string,
};

interface InputValueReference {
    value: string,
};

interface InputRef {
    focus(): void,
};

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (function Input_(
    props,
    ref,
) {
    const { style, icon, name, ...rest } = props;

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const { registerField, defaultValue = '', fieldName, error } = useField(name);

    const inputElementRef = useRef<RNTextInput>(null);
    const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);

        setIsFilled(!!inputValueRef.current.value);
    }, []);

    useImperativeHandle(ref, () => ({
        focus() {
            inputElementRef?.current?.focus();
        },
    }));

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            setValue(_, value: string) {
                inputValueRef.current.value = value;
                inputElementRef?.current?.setNativeProps({ text: value });
            },
            clearValue() {
                inputValueRef.current.value = '';
                inputElementRef?.current?.setNativeProps({ text: '' });
            },
        });
    }, [fieldName, registerField]);

    return(
        <>
            {error && <ErrorText>{error}</ErrorText>}
            <Container style={style} isFocused={isFocused} error={!!error}>
                {icon && (
                    <Icon
                        size={20}
                        name={icon}
                        color={isFocused || isFilled ? '#ff9000' : '#666360'}
                    />
                )}

                <TextInput
                    ref={inputElementRef}
                    keyboardAppearance='dark'
                    placeholderTextColor='#666360'
                    defaultValue={defaultValue}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onChangeText={value => {
                        inputValueRef.current.value = value;
                    }}
                    {...rest}
                />
            </Container>
    </>
    );
});

export default forwardRef(Input);