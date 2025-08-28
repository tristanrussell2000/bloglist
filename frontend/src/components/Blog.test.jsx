import {render, screen} from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'
import {vi} from 'vitest'

const testBlog = {
    title: "This is a blog about testing",
    author: "This is an author",
    likes: 15
}

test('renders content', () => {
    const blog = {
        title: "This is a blog about testing",
        author: "This is an author",
        likes: 15
    }

    render(<Blog blog={blog}/>)

    const element = screen.getByText(text => text.includes("This is a blog about testing"))
    expect(element).toBeDefined()
})

test('clicking the button calls event handler once', async () => {
    const mockHandler = vi.fn()

    render(
        <Blog blog={testBlog} onLike={mockHandler}/>
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText("View")
    await user.click(viewButton)
    const likeButton = screen.getByText("Like")
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(1)
})