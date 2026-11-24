# Expense Tracker

A small expense tracking app built for the CSE-2340 class challenge.

## Built with
- React + Vite
- Tailwind CSS
- shadcn/ui
- React Router

## Features
- Add an expense (title, amount, category)
- Filter by category and see the total
- Open a details page for each expense
- Delete an expense
- Data is saved in localStorage

## Hooks used
- useState: expenses, form fields, filter, dialog
- useEffect: load and save expenses to localStorage
- useNavigate: move between the list and details pages

## Run locally
npm install
npm run dev
