import { NextResponse } from 'next/server'
import { updateSession } from '../../../lib/supabase/middleware'

// Mock the Next.js standard NextResponse
jest.mock('next/server', () => {
    const originalModule = jest.requireActual('next/server')
    return {
        __esModule: true,
        ...originalModule,
        NextResponse: {
            next: jest.fn().mockReturnValue({ cookies: { set: jest.fn(), getAll: jest.fn() } }),
            redirect: jest.fn(),
            json: jest.fn(),
        },
    }
})

// Mock the Supabase SSR client
const mockGetSession = jest.fn()
jest.mock('@supabase/ssr', () => ({
    createServerClient: jest.fn(() => ({
        auth: {
            getSession: mockGetSession,
        },
    })),
}))

describe('Supabase Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
    })

    const createMockRequest = (pathname: string) => {
        return {
            nextUrl: {
                pathname,
                clone: () => ({ pathname, searchParams: new URLSearchParams() }),
            },
            cookies: {
                getAll: jest.fn().mockReturnValue([]),
                set: jest.fn(),
            },
        } as any
    }

    it('allows access to public static assets without authentication', async () => {
        const req = createMockRequest('/favicon.ico')

        await updateSession(req)

        expect(NextResponse.next).toHaveBeenCalled()
        expect(mockGetSession).not.toHaveBeenCalled()
    })

    it('allows access to public pages without authentication', async () => {
        const req = createMockRequest('/auth/login')

        await updateSession(req)

        expect(NextResponse.next).toHaveBeenCalled()
        expect(mockGetSession).not.toHaveBeenCalled()
    })

    it('redirects to login for protected pages when not authenticated', async () => {
        const req = createMockRequest('/dashboard/worker')
        mockGetSession.mockResolvedValueOnce({ data: { session: null } })

        await updateSession(req)

        expect(mockGetSession).toHaveBeenCalled()
        expect(NextResponse.redirect).toHaveBeenCalled()
    })

    it('returns 401 for protected API routes when not authenticated', async () => {
        const req = createMockRequest('/api/protected/data')
        mockGetSession.mockResolvedValueOnce({ data: { session: null } })

        await updateSession(req)

        expect(mockGetSession).toHaveBeenCalled()
        expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, { status: 401 })
    })

    it('allows access to protected pages when authenticated', async () => {
        const req = createMockRequest('/dashboard/worker')
        mockGetSession.mockResolvedValueOnce({ data: { session: { user: { id: '123' } } } })

        await updateSession(req)

        expect(mockGetSession).toHaveBeenCalled()
        expect(NextResponse.next).toHaveBeenCalled()
        expect(NextResponse.redirect).not.toHaveBeenCalled()
    })
})
