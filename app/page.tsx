'use client';

import { useEffect } from 'react'
import Image from "next/image";
import { useTheme } from "./contexts/ThemeContext";
import Card from "./ui/card";
import Button from "./ui/custom-button/button";
import ColorModeSwitch from "./ui/sidenav/color-mode-switch";
import { useRouter } from "next/navigation";
import { Login } from "./lib/login";
import { useState } from "react";
import { ThreeDots } from 'svg-loaders-react'
import { useBoardContext } from "./contexts/BoardContext";
import { faker } from '@faker-js/faker';

export default function Home() {
  const { darkMode } = useTheme()
  const { updateUserId } = useBoardContext();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    Login(inputValue).then((userId) => {
      updateUserId(userId);
      router.push('/dashboard');
    }).catch((error) => {
      setIsError(true);
      console.error(error, 'error login in');
    }).finally(() => {
      setIsLoading(false);
    })
  }

  useEffect(() => {
    setInputValue(faker.internet.email());
  }, [])

  return (
    <main className="login">
      <div>
        {darkMode ? (
          <Image
            src='/assets/logo-light.svg'
            alt='Kanban logo'
            width={153}
            height={26}
            priority={true}
          />
        ) : (
          <Image
            src='/assets/logo-dark.svg'
            alt='Kanban logo'
            width={153}
            height={26}
            priority={true}
          />
        )}
      </div>
      <Card className="login-form">
        <input type="text" placeholder="admin@kanban.com" defaultValue={inputValue}></input>
        <Button buttonType="primary" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? <ThreeDots /> : 'Login'}
        </Button>
        {isLoading && <label>Please wait, demo database are filling up</label>}
        {isError && <label className="error">There's been an error logging in, please try again later</label>}
        <ColorModeSwitch />
      </Card>
    </main>
  )
}
