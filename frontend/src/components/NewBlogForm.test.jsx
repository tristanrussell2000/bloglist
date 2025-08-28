import {render, screen} from '@testing-library/react'
import NewBlogForm from './NewBlogForm'
import userEvent from '@testing-library/user-event'
import {test, vi} from 'vitest'

test('<NewBlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    const container = render(<NewBlogForm onSubmit={createBlog}/>).container

    const input = container.querySelector('input[name="Title"]')
    const sendButton = screen.getByText('Add')

    await user.type(input, 'testing a blog')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toBe('testing a blog')
})