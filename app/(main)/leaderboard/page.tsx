"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading";
import AuthError from "@/components/authError";

const LeaderboardPage = () => {
  const { status: sessionStatus } = useSession();

  const [leaderboard, setLeaderboard] = useState<{ name: string; totalScore: number; rank: number }[]>([]);
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
        setLeaderboard(data);
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
          <table className="table-auto w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-gray-600 font-semibold">Rank</th>
                <th className="px-4 py-2 border-b text-gray-600 font-semibold">Name</th>
                <th className="px-4 py-2 border-b text-gray-600 font-semibold">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user) => (
                <tr key={user.rank}>
                  <td className="px-4 py-2 border-b text-gray-800">{user.rank}</td>
                  <td className="px-4 py-2 border-b text-gray-800">{user.name}</td>
                  <td className="px-4 py-2 border-b text-gray-800">{user.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
