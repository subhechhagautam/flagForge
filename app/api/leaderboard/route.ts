import { NextResponse } from "next/server";
import User from "@/models/userSchema";
import connect from "@/utlis/db";

// GET /api/leaderboard
export async function GET() {
    try {
        // Connect to the database
        await connect();

        // Fetch all users sorted by totalScore in descending order
        const users = await User.find({}).sort({ totalScore: -1 }).select("name totalScore");

        // Add ranks to the users
        const leaderboard = users.map((user, index) => ({
            name: user.name,
            totalScore: user.totalScore,
            rank: index + 1, // Rank starts from 1
        }));

        // Return the leaderboard as JSON
        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return NextResponse.json(
            { error: "Failed to fetch leaderboard" },
            { status: 500 }
        );
    }
}
