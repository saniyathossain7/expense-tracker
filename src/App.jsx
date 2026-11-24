import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

const categories = ["Food", "Transport", "Study", "Fun", "Other"];

const sampleExpenses = [
    { id: 1, title: "Lunch at canteen", amount: 150, category: "Food", date: "2026-11-22" },
    { id: 2, title: "Bus fare", amount: 40, category: "Transport", date: "2026-11-22" },
    { id: 3, title: "Notebook and pens", amount: 220, category: "Study", date: "2026-11-23" },
    { id: 4, title: "Movie ticket", amount: 300, category: "Fun", date: "2026-11-23" }
];

function App() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(function () {
        try {
            const saved = JSON.parse(localStorage.getItem("expenses"));
            setExpenses(Array.isArray(saved) ? saved : sampleExpenses);
        } catch (error) {
            setExpenses(sampleExpenses);
        }
        setLoading(false);
    }, []);

    useEffect(function () {
        if (!loading) {
            localStorage.setItem("expenses", JSON.stringify(expenses));
        }
    }, [expenses, loading]);

    return (
        <div className="min-h-screen bg-background p-6 text-foreground">
            <div className="mx-auto max-w-5xl">
                <h1 className="mb-6 text-3xl font-bold">Expense Tracker</h1>
                <Routes>
                    <Route
                        path="/"
                        element={<Home expenses={expenses} setExpenses={setExpenses} loading={loading} />}
                    />
                    <Route
                        path="/expense/:id"
                        element={<Details expenses={expenses} setExpenses={setExpenses} loading={loading} />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </div>
    );
}

function Home({ expenses, setExpenses, loading }) {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [error, setError] = useState("");

    function addExpense(event) {
        event.preventDefault();
        if (title.trim() === "" || Number(amount) <= 0) {
            setError("Enter a title and an amount greater than 0.");
            return;
        }
        const newExpense = {
            id: Date.now(),
            title: title.trim(),
            amount: Number(amount),
            category: category,
            date: new Date().toLocaleDateString("en-CA")
        };
        setExpenses(function (previous) {
            return [newExpense, ...previous];
        });
        setTitle("");
        setAmount("");
        setCategory("Food");
        setError("");
        setOpen(false);
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    const visibleExpenses = expenses.filter(function (expense) {
        return selectedCategory === "All" || expense.category === selectedCategory;
    });
    const total = visibleExpenses.reduce(function (sum, expense) {
        return sum + expense.amount;
    }, 0);

    return (
        <div className="space-y-5">
            <Card>
                <CardHeader>
                    <CardDescription>
                        {selectedCategory === "All" ? "Total spent" : `Total spent on ${selectedCategory}`}
                    </CardDescription>
                    <CardTitle className="text-3xl">Tk {total}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {visibleExpenses.length} expenses shown
                    </p>
                </CardContent>
            </Card>

            <div className="flex flex-wrap items-center gap-2">
                {["All", ...categories].map(function (name) {
                    return (
                        <Button
                            key={name}
                            size="sm"
                            variant={selectedCategory === name ? "default" : "outline"}
                            onClick={function () {
                                setSelectedCategory(name);
                            }}
                        >
                            {name}
                        </Button>
                    );
                })}
                <Button
                    className="ml-auto"
                    onClick={function () {
                        setOpen(true);
                    }}
                >
                    Add Expense
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add new expense</DialogTitle>
                        <DialogDescription>Write what you spent money on.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={addExpense} className="space-y-3">
                        <Input
                            placeholder="What did you buy?"
                            value={title}
                            onChange={function (event) {
                                setTitle(event.target.value);
                            }}
                        />
                        <Input
                            type="number"
                            min="0"
                            placeholder="Amount in Tk"
                            value={amount}
                            onChange={function (event) {
                                setAmount(event.target.value);
                            }}
                        />
                        <select
                            value={category}
                            onChange={function (event) {
                                setCategory(event.target.value);
                            }}
                            className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                        >
                            {categories.map(function (name) {
                                return (
                                    <option key={name} value={name}>
                                        {name}
                                    </option>
                                );
                            })}
                        </select>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full">
                            Save Expense
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {visibleExpenses.length === 0 ? (
                <p className="text-muted-foreground">No expenses here yet.</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleExpenses.map(function (expense) {
                        return (
                            <Card
                                key={expense.id}
                                className="cursor-pointer transition-transform hover:-translate-y-1"
                                onClick={function () {
                                    navigate(`/expense/${expense.id}`);
                                }}
                            >
                                <CardHeader>
                                    <CardTitle>{expense.title}</CardTitle>
                                    <CardDescription>{expense.date}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <Badge variant="secondary">{expense.category}</Badge>
                                    <span className="font-bold">Tk {expense.amount}</span>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function Details({ expenses, setExpenses, loading }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const expense = expenses.find(function (item) {
        return item.id === Number(id);
    });

    function deleteExpense() {
        setExpenses(function (previous) {
            return previous.filter(function (item) {
                return item.id !== expense.id;
            });
        });
        navigate("/");
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!expense) {
        return <Navigate to="/" replace />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{expense.title}</CardTitle>
                <CardDescription>Spent on {expense.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-2xl font-bold">Tk {expense.amount}</p>
                <Badge variant="secondary">{expense.category}</Badge>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-3">
                <Button onClick={function () {
                    navigate("/");
                }}>
                    Back to List
                </Button>
                <Button variant="destructive" onClick={deleteExpense}>
                    Delete Expense
                </Button>
            </CardFooter>
        </Card>
    );
}

export default App;