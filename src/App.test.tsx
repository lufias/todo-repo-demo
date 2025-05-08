import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders todo list title', () => {
    render(<App />)
    expect(screen.getByText('Todo List')).toBeInTheDocument()
  })

  it('adds a new todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByText('Add')

    await user.type(input, 'New Todo Item')
    await user.click(addButton)

    expect(screen.getByText('New Todo Item')).toBeInTheDocument()
  })

  it('toggles todo completion', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Add a todo
    const input = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByText('Add')
    await user.type(input, 'Toggle Todo')
    await user.click(addButton)

    // Toggle the todo
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    // Check if the todo is marked as completed
    const todoText = screen.getByText('Toggle Todo')
    expect(todoText).toHaveClass('line-through')
  })

  it('deletes a todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    // Add a todo
    const input = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByText('Add')
    await user.type(input, 'Delete Todo')
    await user.click(addButton)

    // Delete the todo
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    // Check if the todo is removed
    expect(screen.queryByText('Delete Todo')).not.toBeInTheDocument()
  })
}) 