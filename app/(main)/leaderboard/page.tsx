"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";

const LeaderboardPage = () => {
  const { status: sessionStatus } = useSession();

  const [leaderboard, setLeaderboard] = useState<
    { name: string; totalScore: number; rank: number; image: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        if (!res.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        const data = await res.json();
        setLeaderboard(
          data
            .sort((a: { totalScore: number; }, b: { totalScore: number; }) => b.totalScore - a.totalScore) // Sort by score in descending order
            .map((user: any, index: number) => ({
              ...user,
              rank: index + 1, // Assign rank based on position
            }))
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionStatus === "authenticated") {
      fetchLeaderboard();
    }
  }, [sessionStatus]);

  if (sessionStatus === "loading" || loading) {
    return <Loading />;
  }

  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center mt-[20vh]">
        <h1 className="text-2xl sm:text-2xl text-center text-rose-500 font-bold">
          Error: {error}
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-[10vh]">
      <h1 className="text-3xl sm:text-3xl text-center text-rose-500 font-bold mb-4">
        Leaderboard
      </h1>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-4">
        {leaderboard.length === 0 ? (
          <p className="text-center text-gray-500">No data available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className="flex flex-col items-center bg-gray-100 rounded-lg p-4 shadow-sm"
              >
                <span className="text-xl font-bold text-rose-500">
                  #{user.rank}
                </span>
                <img
                  src={user.image || "/fallback-avatar.png"}
                  alt={`${user.name}'s avatar`}
                  className="w-20 h-20 rounded-full object-cover mb-2"
                  onError={(e) =>
                    (e.currentTarget.src = "/fallback-avatar.png")
                  }
                />
                <h2 className="text-lg font-semibold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-600">Score: {user.totalScore}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
