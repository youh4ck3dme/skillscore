import React from 'react'
import { render, screen, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../../lib/auth/auth-context'
import { createClient } from '../../../lib/supabase/client'

// Mock dependencies
jest.mock('../../../lib/supabase/client', () => ({
    createClient: jest.fn(),
}))

jest.mock('../../../lib/auth/dev-helpers', () => ({
    shouldBypassAuth: () => false,
    shouldAllowActions: () => false,
    DEV_TEST_USERS: {},
}))

const mockSupabase = {
    auth: {
        getSession: jest.fn(),
        getUser: jest.fn(),
        onAuthStateChange: jest.fn(),
        signInWithPassword: jest.fn(),
        signInWithOAuth: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
    },
    from: jest.fn(),
}

beforeEach(() => {
    jest.clearAllMocks()
        ; (createClient as jest.Mock).mockReturnValue(mockSupabase)

    // Default mock implementations
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } })
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
    })
})

const TestComponent = () => {
    const { user, loading, signIn, signInWithGoogle, signUp, signOut } = useAuth()

    if (loading) return <div>Loading...</div>

    return (
        <div>
            <div data-testid="user-status">{user ? `Logged in as ${user.email}` : 'Not logged in'}</div>
            <button onClick={() => signIn('test@test.com', 'password')}>Sign In</button>
            <button onClick={() => signInWithGoogle()}>Google Sign In</button>
            <button onClick={() => signUp('test@test.com', 'password', 'worker', { full_name: 'Test' })}>Sign Up</button>
            <button onClick={() => signOut()}>Sign Out</button>
        </div>
    )
}

describe('AuthProvider', () => {
    it('shows loading state initially', () => {
        // Make getSession unresolved initially to guarantee loading state is visible
        let resolveSession: any
        mockSupabase.auth.getSession.mockReturnValue(new Promise(resolve => {
            resolveSession = resolve
        }))

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        expect(screen.getByText('Loading...')).toBeInTheDocument()

        // Resolve to prevent open handles
        act(() => {
            resolveSession({ data: { session: null } })
        })
    })

    it('handles successful Google Sign-In', async () => {
        mockSupabase.auth.signInWithOAuth.mockResolvedValue({ error: null })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })

        await act(async () => {
            screen.getByText('Google Sign In').click()
        })

        expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith(
            expect.objectContaining({
                provider: 'google',
                options: expect.objectContaining({
                    redirectTo: expect.stringContaining('/auth/callback')
                })
            })
        )
    })

    it('handles Email/Password Sign Up cleanly after refactor', async () => {
        mockSupabase.auth.signUp.mockResolvedValue({ data: { user: { id: '123' } }, error: null })

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        )

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
        })

        await act(async () => {
            screen.getByText('Sign Up').click()
        })

        expect(mockSupabase.auth.signUp).toHaveBeenCalledWith(
            expect.objectContaining({
                email: 'test@test.com',
                options: expect.objectContaining({
                    data: expect.objectContaining({
                        full_name: 'Test',
                        user_type: 'worker'
                    })
                })
            })
        )
    })
})
