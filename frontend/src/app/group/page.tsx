"use client";

import { useState } from "react";
import { Title } from "@/components/home/Title";
import { LoginBackground } from "@/components/login/LoginBackground";
import { SubmitButton } from "@/components/login/SubmitButton";
import { LoginForm } from "@/components/login/LoginForm";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { ArrowLeft, Plus, X } from "lucide-react";

const MAX_DESCRIPTION_LENGTH = 500;
const MAX_GROUP_SIZE = 10;
const MIN_GROUP_SIZE = 2;

export default function CreateGroupPage() {
    const { user } = useUser();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Group data
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [size, setSize] = useState(2);

    // Tags related state
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [tagError, setTagError] = useState("");

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        if (text.length <= MAX_DESCRIPTION_LENGTH) {
            setDescription(text);
        }
    };

    const handleAddTag = () => {
        setTagError("");

        if (!newTag.trim()) {
            return;
        }

        if (tags.includes(newTag.trim().toLowerCase())) {
            setTagError("This tag was already added");
            return;
        }

        setTags([...tags, newTag.trim().toLowerCase()]);
        setNewTag("");
    };

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in to create a group");
            return;
        }

        if (!name.trim()) {
            setError("Please enter a group name");
            return;
        }

        if (!description.trim()) {
            setError("Please enter a group description");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/token");
            const data = await res.json();
            const token = data.token.value;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    description,
                    numRoomates: size,
                    openToJoin: true,
                    userID: user.id
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create group");
            }




            window.location.href = "/home?searchType=group";
        } catch (error: any) {
            console.error("Create group error:", error);
            setError(error.message || "Failed to create group. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return <div>Please log in to create a group</div>;
    }

    return (
        <div className="flex flex-col gap-8 justify-center items-center min-h-screen py-10 bg-gradient-to-b from-white to-[#E6F3FF]">
            <LoginBackground />
            <Title
                title="Create a Group"
                className="text-4xl font-bold text-[#2774AE] drop-shadow-md relative"
            />

            {/* Back button */}
            <div className="w-full max-w-2xl flex justify-start mb-2">
                <Link
                    href="/home?searchType=group"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2774AE] text-white rounded-lg hover:bg-[#1D5A8A] transition-colors duration-200"
                >
                    <ArrowLeft size={18} />
                    <span>Back to Browse</span>
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl space-y-6 bg-white p-8 rounded-lg shadow-lg relative"
            >
                <div className="space-y-6">
                    <h3 className="text-lg font-medium text-[#2774AE] border-b pb-2">
                        Group Information
                    </h3>

                    <LoginForm
                        id="name"
                        label="Group Name"
                        type="text"
                        value={name}
                        onChange={setName}
                        required
                    />

                    <div className="w-full">
                        <div className="flex justify-between">
                            <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
                                Group Description
                            </label>
                            <span
                                className={`text-xs ${description.length >= MAX_DESCRIPTION_LENGTH * 0.9
                                    ? "text-red-500"
                                    : "text-gray-500"
                                    }`}
                            >
                                {description.length}/{MAX_DESCRIPTION_LENGTH}
                            </span>
                        </div>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Describe your group, what you're looking for in roommates, etc."
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2774AE]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="size" className="block text-gray-700 font-medium mb-1">
                            Group Size <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                id="size"
                                min={MIN_GROUP_SIZE}
                                max={MAX_GROUP_SIZE}
                                value={size}
                                onChange={(e) => setSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2774AE]"
                            />
                            <span className="bg-[#2774AE] text-white font-medium px-3 py-1 rounded-lg min-w-[40px] text-center">
                                {size}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Select how many people you want in your group (including yourself)
                        </p>
                    </div>
                </div>

                <SubmitButton>
                    {isLoading ? "Creating..." : "Create Group"}
                </SubmitButton>

                <div className="flex flex-col justify-center items-center mt-4">
                    {error && <small className="text-red-500">{error}</small>}
                </div>
            </form>
        </div>
    );
}