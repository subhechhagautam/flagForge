"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/loading";
import { Questions } from "@/interfaces";
import { useSession } from "next-auth/react";
import AuthError from "@/components/authError";
import { initialQuestion } from "@/utlis/data";

const Page = ({ params }: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { status: sessionStatus, data: session } = useSession();
  const [problems, setProblems] = useState<Questions>(initialQuestion);
  const [flag, setFlag] = useState<string>(""); // State for the flag input
  const [message, setMessage] = useState<string | null>(null); // State for success/error message

  // Fetch problem data
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/problems/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }
      const data = await response.json();
      if (data.question) {
        setProblems(data.question);
      } else {
        throw new Error("Invalid data format from API");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage("Failed to load problem data.");
    }
  };

  // Handle flag submission
  const handleSubmit = async () => {
    if (problems.isSolved) {
      setMessage("This question is already solved.");
      return;
    }

    try {
      const response = await fetch(`/api/problems/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flag }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Correct flag!"); // Success message
        setProblems((prev) => ({ ...prev, isSolved: true })); // Mark as solved locally
      } else {
        setMessage(result.message || "Incorrect flag. Try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  if (loading || sessionStatus === "loading") {
    return <Loading />;
  }

  if (sessionStatus === "unauthenticated") {
    return <AuthError />;
  }

  return (
    <div className="sm:h-[70vh] mt-[120px]">
      <div className="absolute circlePosition w-screen sm:w-[590px] h-[400px] bg-gradient-to-r from-rose-500 rounded-[100%] top-[50%] left-[50%] blur-[90px] translate-x-[-50%] translate-y-[-50%] z-[-1]" />
      <div className="w-[70%] mx-auto my-0">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl flex items-center justify-center gap-2 text-black font-bold">
              {problems.title || "Unknown Problem"}
              <span className="text-sm hidden sm:block px-[0.4rem] py-[0.18rem] shadow-xl text-center font-normal bg-rose-500 rounded-lg text-white hover:bg-rose-700">
                {problems.category || "N/A"}
              </span>
            </h1>
            <h2 className="text-xl hidden sm:block">
              Points:{" "}
              <span className="text-rose-500 font-extrabold">
                {problems.points || 0}
              </span>
            </h2>
          </div>
          <div className="w-[70vw] border-b-2 border-gray-500"></div>
        </div>
        <div className="mt-8 text-lg flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">Description</h1>
          <h2>{problems.description || "No description provided."}</h2>
        </div>
        <div className="mt-8 text-lg flex justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold">Given Resources</h1>
            <h2 className="font-bold text-sm sm:text-md text-rose-500">
              {problems.link || "No resources provided"}
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold">Hints</h1>
            <h2 className="text-sm sm:text-md px-[0.18rem] py-[0.18rem] shadow-xl text-center bg-rose-500 rounded-lg text-white font-bold hover:bg-rose-700">
              1
            </h2>
          </div>
        </div>
        <div className="mt-[40px] shadow-2xl rounded-2xl p-7 flex flex-col justify-start gap-6">
          <input
            type="text"
            className="py-2 bg-gray-200 px-4 block w-full border-rose-500 rounded-2xl text-base sm:text-lg focus:outline-rose-600"
            placeholder="Flag Starts With: bingo{}"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            disabled={problems.isSolved}
          />
          <button
            className={`bg-rose-500 w-full sm:w-[180px] border border-rose-500 hover:bg-rose-800 rounded-xl px-4 py-2 text-white ${
              problems.isSolved ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSubmit}
            disabled={problems.isSolved}
          >
            {problems.isSolved ? "Solved" : "Submit"}
          </button>
          {message && (
            <div
              className={`text-center text-lg font-bold mt-4 ${
                message.includes("Correct") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
