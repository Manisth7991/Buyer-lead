'use client'

export function SignOutButton() {
    const handleSignOut = () => {
        window.location.href = '/api/auth/signout'
    }

    return (
        <button
            onClick={handleSignOut}
            className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Sign Out
        </button>
    )
}