import { FC, useEffect, useState } from 'react';
import { PasswordInput, PasswordInputProps } from '@mantine/core';
import { BsCapslock, BsCapslockFill } from 'react-icons/bs';

type PasswordInputWithCapsLockProps = PasswordInputProps & { isModal?: boolean };

export const PasswordInputWithCapsLock: FC<PasswordInputWithCapsLockProps> = (props) => {
  const [capsLock, setCapsLock] = useState<boolean>(false);
  const icon = capsLock ? <BsCapslockFill /> : <BsCapslock />;
  const section = props.isModal ? { rightSection: icon } : { leftSection: icon };

  useEffect(() => {
    const handleCapsLock = (event: KeyboardEvent) => {
      setCapsLock(event.getModifierState('CapsLock'));
    };

    window.addEventListener('keydown', handleCapsLock);
    window.addEventListener('keyup', handleCapsLock);

    return () => {
      window.removeEventListener('keydown', handleCapsLock);
      window.removeEventListener('keyup', handleCapsLock);
    };
  }, []);

  return <PasswordInput {...props} {...section} />;
};
