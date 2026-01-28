import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import ToastProvider from './Toast'
import { useToast } from '../lib/useToast'

function TempComponent() {
    const toast = useToast()
    React.useEffect(() => {
        toast.push('Hello test', 'success')
    }, [])
    return null
}

describe('ToastProvider', () => {
    it('renders a toast when pushed', async () => {
        render(
            <ToastProvider>
                <TempComponent/>
            </ToastProvider>
        )

        expect(await screen.findByText('Hello test')).toBeTruthy()
    })
})
