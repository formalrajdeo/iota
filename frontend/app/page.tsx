'use client'
import { DashboardPage, LoginPage, RegisterPage } from "@/components/screens";
import { useState } from "react";

export default function Home() {
  const [showRegisterPage, setShowRegisterPage] = useState(false)
  const [userName, setUserName] = useState("")
  const [showUserDashboardPage, setShowUserDashboardPage] = useState(false)

  if (showRegisterPage) {
    return (
      <main>
        <RegisterPage
          setShowRegisterPage={setShowRegisterPage}
        />
      </main>
    )
  }

  if (showUserDashboardPage) {
    return (
      <main>
        <DashboardPage
          userName={userName}
          setUserName={setUserName}
          setShowUserDashboardPage={setShowUserDashboardPage}
        />
      </main>
    )
  }

  return (
    <main className="">
      <LoginPage
        setShowRegisterPage={setShowRegisterPage}
        setShowUserDashboardPage={setShowUserDashboardPage}
        setUserName={setUserName}
      />
    </main>
  )
}
