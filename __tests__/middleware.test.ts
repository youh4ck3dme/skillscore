import { NextResponse } from 'next/server'
import { middleware } from '../middleware'
import { updateSession } from '../lib/supabase/middleware'

jest.mock('next/server', () => {
    return {
        __esModule: true,
        NextResponse: {
            next: jest.fn(),
        },
    }
})

jest.mock('../lib/supabase/middleware', () => ({
    updateSession: jest.fn(),
}))

describe('Root Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    const createMockRequest = (pathname: string) => {
        return {
            nextUrl: {
                pathname,
            },
        } as any
    }

    it('allows access to sitemap and robots.txt bypassing Supabase middleware', () => {
        const sitemapReq = createMockRequest('/sitemap.xml')
        middleware(sitemapReq)
        expect(NextResponse.next).toHaveBeenCalled()
        expect(updateSession).not.toHaveBeenCalled()

        jest.clearAllMocks()

        const robotsReq = createMockRequest('/robots.txt')
        middleware(robotsReq)
        expect(NextResponse.next).toHaveBeenCalled()
        expect(updateSession).not.toHaveBeenCalled()
    })

    it('delegates all other routes to Supabase updateSession middleware', () => {
        const req = createMockRequest('/dashboard')
        middleware(req)
        expect(updateSession).toHaveBeenCalledWith(req)
        expect(NextResponse.next).not.toHaveBeenCalled()
    })
})
