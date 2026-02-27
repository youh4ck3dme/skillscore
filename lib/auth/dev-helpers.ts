export const DEV_TEST_USERS = {
  admin: {
    id: "550e8400-e29b-41d4-a716-446655440000",
    email: "admin@skillscore.sk",
    user_type: "admin" as const,
    profile: {
      full_name: "Admin User",
      phone: "+421900000000",
    },
  },
  worker: {
    id: "550e8400-e29b-41d4-a716-446655440001",
    email: "test-worker@skillscore.sk",
    user_type: "worker" as const,
    profile: {
      full_name: "Test Pracovník",
      phone: "+421900000001",
    },
  },
  company: {
    id: "550e8400-e29b-41d4-a716-446655440002",
    email: "test-company@skillscore.sk",
    user_type: "company" as const,
    profile: {
      company_name: "Test Firma s.r.o.",
      full_name: "Test Manager",
      phone: "+421900000002",
    },
  },

}

export function isAuthDisabled(): boolean {
  return false
}

export function getDevUser(userType: keyof typeof DEV_TEST_USERS) {
  if (!isAuthDisabled()) return null
  return DEV_TEST_USERS[userType]
}

export function shouldBypassAuth(): boolean {
  return false
}

export function shouldAllowActions(): boolean {
  return false
}
